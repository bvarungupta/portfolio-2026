import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;

async function launchChrome() {
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--user-data-dir=/tmp/chrome-test-profile-" + Date.now(),
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1500));
  return chrome;
}

function sendHttp(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runTest(targetUrl, options = {}) {
  const tabs = await sendHttp(`http://127.0.0.1:${PORT}/json/list`);
  let tabWs = tabs[0]?.webSocketDebuggerUrl;
  if (!tabWs) {
    const newTab = await sendHttp(`http://127.0.0.1:${PORT}/json/new?about:blank`, "PUT");
    tabWs = newTab.webSocketDebuggerUrl;
  }

  const ws = new WebSocket(tabWs);
  await new Promise((resolve) => ws.onopen = resolve);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Set device emulation
  if (options.mobile) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await send("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
    });
  } else {
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
  }

  // Network throttling
  if (options.throttle) {
    // 4G Throttle: 1.6 Mbps download, 750 Kbps upload, 150ms RTT
    await send("Network.enable");
    await send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: "cellular4g",
    });
  } else {
    await send("Network.enable");
  }

  if (options.clearCache) {
    await send("Network.clearBrowserCache");
    await send("Network.clearBrowserCookies");
  }

  await send("Page.enable");
  await send("Runtime.enable");

  // Injected script to track LCP, FCP, hero element visibility, and timeline
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__perfMetrics = {
        lcp: null,
        fcp: null,
        fp: null,
        heroHeadingTime: null,
        heroTaglineTime: null,
        firstProjectTime: null,
        preloaderCompleteTime: null,
      };

      const po = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            window.__perfMetrics.lcp = {
              startTime: entry.startTime,
              size: entry.size,
              id: entry.id,
              url: entry.url,
              elementSnippet: entry.element ? entry.element.outerHTML.slice(0, 200) : null
            };
          }
        }
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });

      window.addEventListener('preloader-complete', () => {
        window.__perfMetrics.preloaderCompleteTime = performance.now();
      });

      function checkElements() {
        const now = performance.now();
        const heading = document.querySelector('[data-hero-element="heading"]');
        if (heading && window.__perfMetrics.heroHeadingTime === null) {
          const style = window.getComputedStyle(heading);
          if (parseFloat(style.opacity) > 0.5) {
            window.__perfMetrics.heroHeadingTime = now;
          }
        }
        const tagline = document.querySelector('[data-hero-element="tagline"]');
        if (tagline && window.__perfMetrics.heroTaglineTime === null) {
          const style = window.getComputedStyle(tagline);
          if (parseFloat(style.opacity) > 0.5) {
            window.__perfMetrics.heroTaglineTime = now;
          }
        }
        const card = document.querySelector('a[href*="/works/"]');
        if (card && window.__perfMetrics.firstProjectTime === null) {
          window.__perfMetrics.firstProjectTime = now;
        }
        if (window.__perfMetrics.heroHeadingTime === null || window.__perfMetrics.firstProjectTime === null) {
          requestAnimationFrame(checkElements);
        }
      }
      requestAnimationFrame(checkElements);
    `
  });

  const startTime = Date.now();
  await send("Page.navigate", { url: targetUrl });

  // Wait for page to stabilize
  await new Promise((resolve) => setTimeout(resolve, options.waitMs || 4000));

  const result = await send("Runtime.evaluate", {
    expression: `
      (() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paints = performance.getEntriesByType('paint');
        const fcp = paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        const fp = paints.find(p => p.name === 'first-paint')?.startTime || 0;
        const resources = performance.getEntriesByType('resource').map(r => ({
          name: r.name,
          initiatorType: r.initiatorType,
          transferSize: r.transferSize,
          duration: r.duration,
          startTime: r.startTime,
          responseEnd: r.responseEnd
        }));

        return {
          nav: {
            domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
            load: nav ? nav.loadEventEnd : 0,
            responseEnd: nav ? nav.responseEnd : 0
          },
          fcp,
          fp,
          custom: window.__perfMetrics,
          resourceCount: resources.length,
          totalTransfer: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
          topTransfers: resources.sort((a,b) => (b.transferSize||0) - (a.transferSize||0)).slice(0, 10)
        };
      })()
    `,
    returnByValue: true,
  });

  await send("Page.close");
  ws.close();

  return result.result?.value;
}

async function main() {
  const chrome = await launchChrome();

  try {
    console.log("=== Scenario 1: Mobile Throttled 4G - Cold Cache ===");
    const s1 = await runTest("http://localhost:3001/", {
      mobile: true,
      throttle: true,
      clearCache: true,
      waitMs: 5000,
    });
    console.log(JSON.stringify(s1, null, 2));

    console.log("\n=== Scenario 2: Mobile - Warm Cache (Repeat Visit) ===");
    const s2 = await runTest("http://localhost:3001/", {
      mobile: true,
      throttle: false,
      clearCache: false,
      waitMs: 3000,
    });
    console.log(JSON.stringify(s2, null, 2));

    console.log("\n=== Scenario 3: Desktop Standard - Cold Cache ===");
    const s3 = await runTest("http://localhost:3001/", {
      mobile: false,
      throttle: false,
      clearCache: true,
      waitMs: 3000,
    });
    console.log(JSON.stringify(s3, null, 2));

    console.log("\n=== Scenario 4: Direct Entry to Project Page (/works/jio) - Mobile ===");
    const s4 = await runTest("http://localhost:3001/works/jio", {
      mobile: true,
      throttle: false,
      clearCache: true,
      waitMs: 3000,
    });
    console.log(JSON.stringify(s4, null, 2));

  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
