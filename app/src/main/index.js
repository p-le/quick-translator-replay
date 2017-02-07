'use strict'

import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import { Translator } from './translate/Translator'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  let translator = new Translator()

  mainWindow = new BrowserWindow({
    height: 720,
    width: 1280
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('translate', (event, arg) => {
    translator.translate(event, arg)
  })

  ipcMain.on('getText', (event, arg) => {
    event.sender.send('textReceived', clipboard.readText())
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
