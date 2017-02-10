'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { Translator } from './translate/Translator'
const log = require('electron-log')
const fs = require('fs')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  let translator = new Translator()
  log.transports.console.level = 'warn'
  log.transports.console.format = '{h}:{i}:{s}:{ms} {text}'
  log.transports.console.format = (msg) => msg.text
  log.transports.file.level = 'warn'
  log.transports.file.format = '{h}:{i}:{s} {text}'
  log.transports.file.maxSize = 5 * 1024 * 1024
  log.transports.file.file = `${__dirname}/log.txt`
  log.transports.file.streamConfig = { flags: 'w' }
  log.transports.file.stream = fs.createWriteStream('log.txt')
  log.appName = 'qt'

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
    }).catch(err => log.error(err))

    translator.translateByModel(event, text).then(translatedTokens => {
      event.sender.send('translate/by/model', {
        result: translatedTokens.join(' '),
        status: false
      })
    }).catch(err => log.error(err))
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
