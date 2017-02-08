'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { Translator } from './translate/Translator'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  let translator = new Translator()

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('translate', (event, text) => {
    translator.translateChinese(event, text).then(translatedLines => {
      event.sender.send('translate/by/ZhVn', {
        result: translatedLines.join('\r\n'),
        status: false
      })
    })

    translator.translateByModel(event, text).then(translatedTokens => {
      event.sender.send('translate/by/model', {
        result: translatedTokens.join(' '),
        status: false
      })
    })
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
