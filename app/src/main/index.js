'use strict'

import { app, BrowserWindow, ipcMain, globalShortcut, clipboard } from 'electron'
import { Translator } from './translate/Translator'

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false
  })

  mainWindow.loadURL(winURL)

  let translator = new Translator()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  globalShortcut.register('CommandOrControl+V', () => {
    let text = clipboard.readText()
    text = text.split(/\r?\n/).filter(line => line !== '').map(line => line.trimLeft()).join('\r\n')
    mainWindow.webContents.send('GET_TEXT', text)
  })

  ipcMain.on('translate', (event, text) => {
    translator.translateChinese(event, text).then(translatedLines => {
      event.sender.send('translate/by/ZhVn', {
        result: translatedLines.join('\r\n'),
        status: false
      })
    }).catch(err => console.log(err))

    translator.translateByModel(event, text).then(translatedTokens => {
      const result = translatedTokens.join(' ')
      clipboard.writeText(result)
      event.sender.send('translate/by/model', {
        result,
        status: false
      })
    }).catch(err => console.log(err))
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
