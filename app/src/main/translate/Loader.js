import * as fs from 'fs'

const LACVIET_DICT_PATH = 'dicts/TDLacViet.txt'
const BABYLON_DICT_PATH = 'dicts/TDBabylon.txt'
const THIEUCHUU_DICT_PATH = 'dicts/TDThieuChuu.txt'
export class Loader {
  loadHanVietDict () {
    return new Promise((resolve, reject) => {
      const path = `dicts/PhienAmHanViet.txt`
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          resolve(dict)
        }
      })
    })
  }

  loadPhraseDict () {
    return new Promise((resolve, reject) => {
      const path = `dicts/CVPhrase.txt`
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(`Phrase ${dict.size}`)
          resolve(dict)
        }
      })
    })
  }

  loadNameDict () {
    return new Promise((resolve, reject) => {
      fs.readFile('dicts/CVName.txt', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(`Name ${dict.size}`)
          resolve(dict)
        }
      })
    })
  }

  loadLacVietDict () {
    return new Promise((resolve, reject) => {
      fs.readFile(LACVIET_DICT_PATH, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(`Lacviet ${dict.size}`)
          resolve(dict)
        }
      })
    })
  }

  loadBabylonDict () {
    return new Promise((resolve, reject) => {
      fs.readFile(BABYLON_DICT_PATH, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(`Babylon ${dict.size}`)
          resolve(dict)
        }
      })
    })
  }
  loadThieuChuuDict () {
    return new Promise((resolve, reject) => {
      fs.readFile(THIEUCHUU_DICT_PATH, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(`ThieuChuu ${dict.size}`)
          resolve(dict)
        }
      })
    })
  }
}
