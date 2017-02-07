'use strict'

import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import * as fs from 'fs'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 720,
    width: 1280
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('translate', (event, arg) => {
    console.log(arg)
  })

  ipcMain.on('getText', (event, arg) => {
    console.log(clipboard.readText())
    event.sender.send('textReceived', clipboard.readText())
  })

  // fs.readFile(`${__dirname}/dictionary/Shortcuts.txt`, 'utf8', (err, contents) => {
  //   if (err) console.log(err)
  //   else console.log(contents)
  // })
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

// app.on('browser-window-created', (e, window) => {
//   window.setMenu(null)
// })
