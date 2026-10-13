import { spawn } from 'child_process'
import fs from 'fs'

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--use-gl=angle',
    '--no-sandbox',
    'about:blank'
  ])

  try {
    await new Promise(r => setTimeout(r, 1500))
    const version = await fetch('http://127.0.0.1:9223/json/new?http://localhost:3000', { method: 'PUT' }).then(r => r.json())
    const ws = new WebSocket(version.webSocketDebuggerUrl)
    
    let msgId = 1
    const pending = new Map()
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result)
        pending.delete(data.id)
      }
    }

    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++
      pending.set(id, resolve)
      ws.send(JSON.stringify({ id, method, params }))
    })

    await new Promise(r => ws.onopen = r)
    await send('Page.enable')
    await send('Runtime.enable')

    // Set mobile 393px
    await send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 2, mobile: true })
    await send('Runtime.evaluate', { expression: 'sessionStorage.setItem("portfolio-preloader-shown", "true"); location.reload();' })
    await new Promise(r => setTimeout(r, 3000))

    // Capture at y = 0
    const snap0 = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/mobile_393_scroll_0.png', Buffer.from(snap0.data, 'base64'))

    // Scroll to y = 180
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 180);' })
    await new Promise(r => setTimeout(r, 600))
    const snap180 = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/mobile_393_scroll_180.png', Buffer.from(snap180.data, 'base64'))

    // Scroll to y = 360
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 360);' })
    await new Promise(r => setTimeout(r, 600))
    const snap360 = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/mobile_393_scroll_360.png', Buffer.from(snap360.data, 'base64'))

    // Test 430px
    await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 2, mobile: true })
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' })
    await new Promise(r => setTimeout(r, 500))
    const snap430_0 = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/mobile_430_scroll_0.png', Buffer.from(snap430_0.data, 'base64'))

    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 250);' })
    await new Promise(r => setTimeout(r, 600))
    const snap430_250 = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/mobile_430_scroll_250.png', Buffer.from(snap430_250.data, 'base64'))

    // Test desktop 1440px
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false })
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' })
    await new Promise(r => setTimeout(r, 500))
    const snapDesktop = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync('scratch/desktop_1440_scroll_0.png', Buffer.from(snapDesktop.data, 'base64'))

    console.log('All verification snapshots captured successfully!')
    ws.close()
  } finally {
    chrome.kill()
  }
}

run().catch(console.error)
