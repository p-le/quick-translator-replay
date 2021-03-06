'use strict'

import { app, BrowserWindow, ipcMain, globalShortcut, clipboard } from 'electron'
const electronLocalshortcut = require('electron-localshortcut')
import { Translator, DictFinder } from './translate'
import { AVLTree } from './utils/AVLTree'
import { Segmenter } from './segmenter'

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    frame: false
  })

  mainWindow.loadURL(winURL)
  const translator = new Translator()
  const dictFinder = new DictFinder()
  const segmenter = new Segmenter()
  const avlTree = AVLTree.from([10, 20, 30, 40, 50, 25])
  console.log(JSON.stringify(avlTree))

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
      event.sender.send('translate/by/model', {
        result: JSON.stringify(result),
        status: false
      })
    }).catch(err => console.log(err))
  })

  ipcMain.on('search/dict/text', (event, text) => {
    Promise.all([
      dictFinder.findLacVietDict(text),
      dictFinder.findBabylonDict(text),
      dictFinder.findThieuChuuDict(text),
      translator.getSubTokens(text)
    ]).then(
      ([lacvietResult, babylonResult, thieuchuuResult, subTokens]) => {
        console.log('result + ', [lacvietResult, babylonResult, thieuchuuResult, subTokens])
        event.sender.send('search/dict/text/result', {
          lacvietResult,
          babylonResult,
          thieuchuuResult,
          subTokens
        })
      },
      (reason) => console.log(reason)
    )
  })

  ipcMain.on('search/dict/subtoken', (event, text) => {
    Promise.all([
      dictFinder.findLacVietDict(text),
      dictFinder.findBabylonDict(text),
      dictFinder.findThieuChuuDict(text)
    ]).then(
      ([lacvietResult, babylonResult, thieuchuuResult]) => {
        event.sender.send('search/dict/subtoken/result', {
          lacvietResult,
          babylonResult,
          thieuchuuResult
        })
      },
      (reason) => console.log(reason)
    )
  })

  ipcMain.on('dict/count', (event, arg) => {
    event.sender.send('dict/count/result', {
      Phrase: translator.phraseDict.size,
      Name: translator.nameDict.size,
      Hanviet: translator.hanvietDict.size,
      Lacviet: dictFinder.lacvietDict.size,
      Babylon: dictFinder.babylonDict.size,
      ThieuChuu: dictFinder.thieuChuuDict.size
    })
  })

  ipcMain.on('test', (event, arg) => {
    segmenter.analyze(arg)
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
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

