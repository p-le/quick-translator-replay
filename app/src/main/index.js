'use strict'

import { app, BrowserWindow, ipcMain, globalShortcut, clipboard } from 'electron'
import { Translator } from './translate/Translator'
const electronLocalshortcut = require('electron-localshortcut')

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
  const searchDictWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    frame: false,
    width: 320,
    height: 640
  })
  mainWindow.loadURL(winURL)

  let translator = new Translator()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  electronLocalshortcut.register('CommandOrControl+V', () => {
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

    translator.translateByModel(event, text).then(result => {
      console.log(result)
      event.sender.send('translate/by/model', {
        result: JSON.stringify(result),
        status: false
      })
    }).catch(err => console.log(err))
  })

  ipcMain.on('search/dict', (event, arg) => {
    if (!searchDictWindow.isVisible()) {
      searchDictWindow.focus()
      searchDictWindow.loadURL(`${winURL}/#/search`)
      searchDictWindow.once('ready-to-show', () => {
        searchDictWindow.show()
      })
    } else {
      // send arg to searchDicht window
    }
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

