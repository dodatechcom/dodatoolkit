import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0a0a1a',
    show: false,
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.maximize()
    mainWindow?.show()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('window-minimize', () => mainWindow?.minimize())
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.handle('window-close', () => mainWindow?.close())

ipcMain.handle('save-file', async (_event, options: { defaultName: string; filters: { name: string; extensions: string[] }[]; data: string }) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: options.defaultName,
    filters: options.filters,
  })
  if (!result.canceled && result.filePath) {
    return result.filePath
  }
  return null
})

ipcMain.handle('open-external', async (_event, url: string) => {
  if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
    await shell.openExternal(url)
  }
})

ipcMain.handle('fetch-url-metadata', async (_event, targetUrl: string) => {
  try {
    if (!targetUrl || typeof targetUrl !== 'string') {
      return { error: 'Invalid URL provided' }
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 7000)

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timer)

    if (!response.ok) {
      return { error: `Server responded with HTTP ${response.status}` }
    }

    const html = await response.text()

    const getMeta = (prop: string) => {
      const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const m =
        html.match(new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:|twitter:)?${escaped}["'][^>]+content=["']([^"']*)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["'](?:og:|twitter:)?${escaped}["']`, 'i'))
      return m ? m[1].trim() : ''
    }

    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = getMeta('title') || (titleTag ? titleTag[1].trim() : '')
    const description = getMeta('description')
    let image = getMeta('image')
    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, targetUrl).href
      } catch {}
    }
    const siteName = getMeta('site_name') || new URL(targetUrl).hostname

    return {
      title,
      description,
      image,
      siteName,
      url: targetUrl,
    }
  } catch (err: any) {
    return { error: err?.name === 'AbortError' ? 'Request timed out' : (err?.message || 'Could not fetch metadata') }
  }
})
