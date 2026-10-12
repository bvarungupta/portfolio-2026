import { spawn } from "child_process";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9225;

async function launchChrome(cleanProfile = true) {
  const flags = [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
  ];
  if (cleanProfile) {
    flags.push(`--user-data-dir=/tmp/chrome-scenarios-${Date.now()}`);
  }

  const chrome = spawn(CHROME_PATH, flags);
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

async function runScenario(name, url, options = {}) {
  const { ws, send } = await connectBrowser();

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  const sessionSend = (method, params = {}) => send(method, params, sessionId);

  await sessionSend("Page.enable");
  await sessionSend("Network.enable");
  await sessionSend("Runtime.enable");

  if (options.mobile) {
    await sessionSend("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await sessionSend("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
    });
  } else {
    await sessionSend("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
  }

  if (options.throttle) {
    // 4G mobile conditions
    await sessionSend("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: "cellular4g",
    });
  }

  if (options.clearCache) {
    await sessionSend("Network.clearBrowserCache");
    await sessionSend("Network.clearBrowserCookies");
  }

  // Pre-load observer for accurate timing
  await sessionSend("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__realMetrics = {
        fp: null,
        fcp: null,
        lcp: null,
        lcpTimeline: [],
        heroHeadingVisible: null,
        heroTaglineVisible: null,
        firstProjectVisible: null,
        preloaderComplete: null,
        longTasks: []
      };

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') window.__realMetrics.fp = entry.startTime;
          if (entry.name === 'first-contentful-paint') window.__realMetrics.fcp = entry.startTime;
        }
      }).observe({ type: 'paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const info = {
            startTime: entry.startTime,
            size: entry.size,
            url: entry.url,
            tagName: entry.element ? entry.element.tagName : null,
            id: entry.id,
            outerHTML: entry.element ? entry.element.outerHTML.slice(0, 150) : null
          };
          window.__realMetrics.lcp = info;
          window.__realMetrics.lcpTimeline.push(info);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__realMetrics.longTasks.push({
            startTime: entry.startTime,
            duration: entry.duration
          });
        }
      }).observe({ type: 'longtask', buffered: true });

      window.addEventListener('preloader-complete', () => {
        window.__realMetrics.preloaderComplete = performance.now();
      });

      function pollVisible() {
        const now = performance.now();
        const heading = document.querySelector('[data-hero-element="heading"]');
        if (heading && window.__realMetrics.heroHeadingVisible === null) {
          const s = window.getComputedStyle(heading);
          if (parseFloat(s.opacity) > 0.5) window.__realMetrics.heroHeadingVisible = now;
        }
        const tagline = document.querySelector('[data-hero-element="tagline"]');
        if (tagline && window.__realMetrics.heroTaglineVisible === null) {
          const s = window.getComputedStyle(tagline);
          if (parseFloat(s.opacity) > 0.5) window.__realMetrics.heroTaglineVisible = now;
        }
        const card = document.querySelector('a[href*="/works/"]');
        if (card && window.__realMetrics.firstProjectVisible === null) {
          const s = window.getComputedStyle(card);
          if (parseFloat(s.opacity) > 0.5) window.__realMetrics.firstProjectVisible = now;
        }
        if (window.__realMetrics.heroHeadingVisible === null || window.__realMetrics.firstProjectVisible === null) {
          requestAnimationFrame(pollVisible);
        }
      }
      requestAnimationFrame(pollVisible);
    `
  });

  await sessionSend("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, options.waitMs || 6000));

  const evalRes = await sessionSend("Runtime.evaluate", {
    expression: `
      (() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const res = performance.getEntriesByType('resource');
        return {
          metrics: window.__realMetrics,
          navigation: {
            responseEnd: nav ? nav.responseEnd : 0,
            domInteractive: nav ? nav.domInteractive : 0,
            domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
            load: nav ? nav.loadEventEnd : 0
          },
          resourceCount: res.length,
          totalTransfer: res.reduce((a, b) => a + (b.transferSize || 0), 0),
          topTransfers: res
            .map(r => ({ name: r.name.split('/').pop().split('?')[0] || r.name, size: r.transferSize, type: r.initiatorType, duration: Math.round(r.duration) }))
            .sort((a,b) => (b.size||0) - (a.size||0))
            .slice(0, 8)
        };
      })()
    `,
    returnByValue: true,
  });

  await send("Target.closeTarget", { targetId });
  ws.close();

  return evalRes?.result?.value;
}

async function main() {
  const chrome = await launchChrome();

  try {
    console.log("=== RUNNING SCENARIO 1: Mobile Throttled 4G (Cold Cache) ===");
    const s1 = await runScenario("mobile-cold-throttled", "http://localhost:3001/", {
      mobile: true,
      throttle: true,
      clearCache: true,
      waitMs: 7000,
    });
    console.log(JSON.stringify(s1, null, 2));

    console.log("\n=== RUNNING SCENARIO 2: Mobile Unthrottled (Warm / Repeat Visit) ===");
    const s2 = await runScenario("mobile-warm", "http://localhost:3001/", {
      mobile: true,
      throttle: false,
      clearCache: false,
      waitMs: 4000,
    });
    console.log(JSON.stringify(s2, null, 2));

    console.log("\n=== RUNNING SCENARIO 3: Desktop Standard Connection (Cold Cache) ===");
    const s3 = await runScenario("desktop-cold", "http://localhost:3001/", {
      mobile: false,
      throttle: false,
      clearCache: true,
      waitMs: 4000,
    });
    console.log(JSON.stringify(s3, null, 2));

    console.log("\n=== RUNNING SCENARIO 4: Direct Entry to Project Page (/works/jio) on Mobile ===");
    const s4 = await runScenario("project-page-direct", "http://localhost:3001/works/jio", {
      mobile: true,
      throttle: false,
      clearCache: true,
      waitMs: 4000,
    });
    console.log(JSON.stringify(s4, null, 2));

    console.log("\n=== RUNNING SCENARIO 5: Live Site https://www.bvarungupta.com/ (Mobile Cold Throttled) ===");
    const s5 = await runScenario("live-mobile-cold", "https://www.bvarungupta.com/", {
      mobile: true,
      throttle: true,
      clearCache: true,
      waitMs: 8000,
    });
    console.log(JSON.stringify(s5, null, 2));

  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
