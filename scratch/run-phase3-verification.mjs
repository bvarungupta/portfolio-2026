import { spawn } from "child_process";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9232;

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

async function runSingleTest(options = {}) {
  const { ws, send } = await connectBrowser();
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const sSend = (method, params = {}) => send(method, params, sessionId);

  await sSend("Page.enable");
  await sSend("Network.enable");
  await sSend("Runtime.enable");

  if (options.mobile) {
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
  } else {
    await sSend("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
  }

  if (options.throttle) {
    await sSend("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: "cellular4g",
    });
  }

  if (options.clearCache) {
    await sSend("Network.clearBrowserCache");
    await sSend("Network.clearBrowserCookies");
  }

  await sSend("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__metrics = {
        fp: null,
        fcp: null,
        lcp: null,
        heroHeading: null,
        heroTagline: null,
        firstProject: null,
        preloaderComplete: null,
      };

      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.name === 'first-paint') window.__metrics.fp = e.startTime;
          if (e.name === 'first-contentful-paint') window.__metrics.fcp = e.startTime;
        }
      }).observe({ type: 'paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__metrics.lcp = {
            time: e.startTime,
            size: e.size,
            url: e.url,
            tag: e.element ? e.element.tagName : null,
            outerHTML: e.element ? e.element.outerHTML.slice(0, 100) : null
          };
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      window.addEventListener('preloader-complete', () => {
        window.__metrics.preloaderComplete = performance.now();
      });

      function poll() {
        const now = performance.now();
        const heading = document.querySelector('[data-hero-element="heading"]');
        if (heading && window.__metrics.heroHeading === null) {
          if (parseFloat(window.getComputedStyle(heading).opacity) > 0.5) window.__metrics.heroHeading = now;
        }
        const tagline = document.querySelector('[data-hero-element="tagline"]');
        if (tagline && window.__metrics.heroTagline === null) {
          if (parseFloat(window.getComputedStyle(tagline).opacity) > 0.5) window.__metrics.heroTagline = now;
        }
        const proj = document.querySelector('a[href*="/works/"]');
        if (proj && window.__metrics.firstProject === null) {
          if (parseFloat(window.getComputedStyle(proj).opacity) > 0.5) window.__metrics.firstProject = now;
        }
        if (window.__metrics.heroHeading === null || window.__metrics.firstProject === null) {
          requestAnimationFrame(poll);
        }
      }
      requestAnimationFrame(poll);
    `
  });

  await sSend("Page.navigate", { url: options.url || "http://localhost:3001/" });
  await new Promise((r) => setTimeout(r, options.waitMs || 6000));

  const result = await sSend("Runtime.evaluate", {
    expression: `
      (() => {
        const res = performance.getEntriesByType('resource');
        const imgRes = res.filter(r => r.initiatorType === 'img' || r.initiatorType === 'image' || r.name.match(/\\.(png|jpg|jpeg|webp|svg|gif)($|\\?)/i));
        return {
          metrics: window.__metrics,
          requestCount: res.length,
          totalTransfer: res.reduce((a, b) => a + (b.transferSize || 0), 0),
          imageCount: imgRes.length,
          imageTransfer: imgRes.reduce((a, b) => a + (b.transferSize || 0), 0),
          imageUrls: imgRes.map(i => i.name.split('/').pop().split('?')[0])
        };
      })()
    `,
    returnByValue: true
  });

  await send("Target.closeTarget", { targetId });
  ws.close();

  return result.result?.value;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  const chrome = await launchChrome();

  try {
    console.log("=== RUNNING 3 COLD-CACHE MOBILE RUNS ===");
    const mobileRuns = [];
    for (let i = 1; i <= 3; i++) {
      console.log(`Mobile Run ${i}...`);
      const r = await runSingleTest({
        mobile: true,
        throttle: true,
        clearCache: true,
        waitMs: 7000,
      });
      mobileRuns.push(r);
      console.log(`Run ${i} result:`, {
        fcp: r.metrics.fcp,
        lcpTime: r.metrics.lcp?.time,
        lcpTag: r.metrics.lcp?.tag,
        heroHeading: r.metrics.heroHeading,
        heroTagline: r.metrics.heroTagline,
        firstProject: r.metrics.firstProject,
        preloaderComplete: r.metrics.preloaderComplete,
        requestCount: r.requestCount,
        totalTransferKB: Math.round(r.totalTransfer / 1024),
        imageCount: r.imageCount,
        imageTransferKB: Math.round(r.imageTransfer / 1024)
      });
    }

    const medMobile = {
      fcp: median(mobileRuns.map(r => r.metrics.fcp)),
      lcp: median(mobileRuns.map(r => r.metrics.lcp?.time || 0)),
      heroHeading: median(mobileRuns.map(r => r.metrics.heroHeading)),
      heroTagline: median(mobileRuns.map(r => r.metrics.heroTagline)),
      firstProject: median(mobileRuns.map(r => r.metrics.firstProject)),
      preloaderComplete: median(mobileRuns.map(r => r.metrics.preloaderComplete || 0)),
      requestCount: median(mobileRuns.map(r => r.requestCount)),
      totalTransferKB: median(mobileRuns.map(r => Math.round(r.totalTransfer / 1024))),
      imageCount: median(mobileRuns.map(r => r.imageCount)),
      imageTransferKB: median(mobileRuns.map(r => Math.round(r.imageTransfer / 1024)))
    };
    console.log("\n=== MEDIAN COLD-CACHE MOBILE ===", medMobile);

    console.log("\n=== RUNNING DESKTOP RUN ===");
    const desktopRun = await runSingleTest({
      mobile: false,
      throttle: false,
      clearCache: true,
      waitMs: 4000
    });
    console.log("Desktop result:", {
      fcp: desktopRun.metrics.fcp,
      lcpTime: desktopRun.metrics.lcp?.time,
      lcpTag: desktopRun.metrics.lcp?.tag,
      heroHeading: desktopRun.metrics.heroHeading,
      heroTagline: desktopRun.metrics.heroTagline,
      firstProject: desktopRun.metrics.firstProject,
      preloaderComplete: desktopRun.metrics.preloaderComplete,
      requestCount: desktopRun.requestCount,
      totalTransferKB: Math.round(desktopRun.totalTransfer / 1024),
      imageCount: desktopRun.imageCount,
      imageTransferKB: Math.round(desktopRun.imageTransfer / 1024)
    });

  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
