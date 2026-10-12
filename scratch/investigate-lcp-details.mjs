import { spawn } from "child_process";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9235;

async function launchChrome() {
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
  ]);
  await new Promise((r) => setTimeout(r, 1500));
  return chrome;
}

async function connectBrowser() {
  const version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve) => {
      const id = reqId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });

  return { ws, send };
}

async function runDetailedTrace(targetUrl, runIndex) {
  const { ws, send } = await connectBrowser();
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const sSend = (method, params = {}) => send(method, params, sessionId);

  await sSend("Page.enable");
  await sSend("Network.enable");
  await sSend("Runtime.enable");

  // Mobile emulation (iPhone 14 / viewport 390x844)
  await sSend("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await sSend("Emulation.setUserAgentOverride", {
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  });

  // Mobile 4G throttle (1.6 Mbps download, 750 Kbps upload, 150ms latency)
  await sSend("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: "cellular4g",
  });

  // Clean cold cache
  await sSend("Network.clearBrowserCache");
  await sSend("Network.clearBrowserCookies");

  // Injected observer to capture every LCP candidate event
  await sSend("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__deepLcp = {
        candidates: [],
        finalLcp: null,
        heroHeadingVisible: null,
        heroTaglineVisible: null,
        preloaderComplete: null,
        preloaderStartTime: performance.now(),
        angelLeftVisible: null,
        tejasVisible: null,
      };

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const rect = entry.element ? entry.element.getBoundingClientRect() : null;
          const candidate = {
            startTime: Math.round(entry.startTime),
            size: entry.size,
            url: entry.url || "(text)",
            id: entry.id,
            tagName: entry.element ? entry.element.tagName : null,
            className: entry.element ? entry.element.className : null,
            rect: rect ? { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) } : null,
            snippet: entry.element ? entry.element.outerHTML.slice(0, 160) : null
          };
          window.__deepLcp.candidates.push(candidate);
          window.__deepLcp.finalLcp = candidate;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      window.addEventListener('preloader-complete', () => {
        window.__deepLcp.preloaderComplete = Math.round(performance.now());
      });

      function pollVisibility() {
        const now = Math.round(performance.now());
        const heading = document.querySelector('[data-hero-element="heading"]');
        if (heading && window.__deepLcp.heroHeadingVisible === null) {
          if (parseFloat(window.getComputedStyle(heading).opacity) > 0.5) window.__deepLcp.heroHeadingVisible = now;
        }
        const tagline = document.querySelector('[data-hero-element="tagline"]');
        if (tagline && window.__deepLcp.heroTaglineVisible === null) {
          if (parseFloat(window.getComputedStyle(tagline).opacity) > 0.5) window.__deepLcp.heroTaglineVisible = now;
        }
        const al = document.querySelector('[data-hero-angel="left"] img');
        if (al && window.__deepLcp.angelLeftVisible === null) {
          if (parseFloat(window.getComputedStyle(al).opacity) > 0.5) window.__deepLcp.angelLeftVisible = now;
        }
        const tejas = document.querySelector('[data-hero-angel="right"] img');
        if (tejas && window.__deepLcp.tejasVisible === null) {
          if (parseFloat(window.getComputedStyle(tejas).opacity) > 0.5) window.__deepLcp.tejasVisible = now;
        }
        requestAnimationFrame(pollVisibility);
      }
      requestAnimationFrame(pollVisibility);
    `
  });

  const navStart = Date.now();
  await sSend("Page.navigate", { url: targetUrl });

  // Wait 9s for 4G throttle completion
  await new Promise((r) => setTimeout(r, 9000));

  const evalResult = await sSend("Runtime.evaluate", {
    expression: `
      (() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paints = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource');

        // Detailed timeline for images and SVGs
        const imageTimings = resources
          .filter(r => r.name.match(/\\.(svg|png|webp|jpg|jpeg)($|\\?)/i) || r.initiatorType === 'img' || r.initiatorType === 'image')
          .map(r => ({
            name: r.name.split('/').pop().split('?')[0],
            url: r.name,
            initiatorType: r.initiatorType,
            transferSize: r.transferSize,
            decodedBodySize: r.decodedBodySize,
            startTime: Math.round(r.startTime),
            responseStart: Math.round(r.responseStart),
            responseEnd: Math.round(r.responseEnd),
            duration: Math.round(r.duration)
          }));

        return {
          paint: {
            fp: Math.round(paints.find(p => p.name === 'first-paint')?.startTime || 0),
            fcp: Math.round(paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0),
          },
          lcpData: window.__deepLcp,
          imageTimings,
          totalTransfer: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
          requestCount: resources.length
        };
      })()
    `,
    returnByValue: true
  });

  await send("Target.closeTarget", { targetId });
  ws.close();

  return evalResult?.result?.value;
}

async function main() {
  const chrome = await launchChrome();

  try {
    console.log("=== STARTING 3 CONTROLLED COLD-CACHE MOBILE RUNS ===");
    const runs = [];
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- RUN ${i} ---`);
      const r = await runDetailedTrace("http://localhost:3001/", i);
      runs.push(r);
      console.log("Paint:", r.paint);
      console.log("LCP Candidate Progression:");
      r.lcpData.candidates.forEach((c, idx) => {
        console.log(`  Candidate #${idx + 1}: ${c.tagName} (${c.url}) painted at ${c.startTime}ms, size=${c.size}, rect=`, c.rect);
      });
      console.log("Final LCP:", r.lcpData.finalLcp);
      console.log("Preloader complete at:", r.lcpData.preloaderComplete);
      console.log("Hero heading visible at:", r.lcpData.heroHeadingVisible);
      console.log("Hero tagline visible at:", r.lcpData.heroTaglineVisible);
      console.log("Angel left visible at:", r.lcpData.angelLeftVisible);
      console.log("Tejas visible at:", r.lcpData.tejasVisible);
      console.log("Image timings:");
      r.imageTimings.forEach((img) => {
        const delayAfterResponse = r.lcpData.finalLcp?.startTime ? r.lcpData.finalLcp.startTime - img.responseEnd : null;
        console.log(`  ${img.name} (${img.transferSize} bytes): start=${img.startTime}ms, responseEnd=${img.responseEnd}ms, dur=${img.duration}ms | delayToFinalLcp=${delayAfterResponse}ms`);
      });
    }

  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
