import { spawn } from 'child_process'

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ])

  await new Promise(r => setTimeout(r, 1200))
  const version = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000', { method: 'PUT' }).then(r => r.json())
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
  await send('Console.enable')
  ws.on('message', (msg) => {
    const m = JSON.parse(msg.toString())
    if (m.method === 'Console.messageAdded') {
      console.log('CONSOLE:', m.params.message.text)
    }
  })

  await send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 2, mobile: true })
  await send('Runtime.evaluate', { expression: 'sessionStorage.setItem("portfolio-preloader-shown", "true"); location.reload();' })
  await new Promise(r => setTimeout(r, 3000))

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvases = Array.from(document.querySelectorAll("canvas"));
      return JSON.stringify(canvases.map(c => {
        const gl = c.getContext('webgl');
        return {
          hasGL: !!gl,
          glError: gl ? gl.getError() : null,
        };
      }));
    })()`,
    returnByValue: true
  })
  console.log('GL test:', info.result.value)

  ws.close()
  chrome.kill()
}

run().catch(console.error)
