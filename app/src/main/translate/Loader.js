import * as fs from 'fs'

export class Loader {

  loadHanVietDict () {
    console.log('load dict')

    return new Promise((resolve, reject) => {
      const path = `dicts/PhienAmHanViet.txt`
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(dict.size)
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
          console.log(dict.size)
          resolve(dict)
        }
      })
    })
  }

  loadNameDict () {
    return new Promise((resolve, reject) => {
      fs.readFile('dicts/CVName.txt', (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          const dict = new Map()
          data.toString().split(/\r?\n/).filter(line => line.length > 0).forEach((line) => {
            const [key, value] = line.split('=')
            dict.set(key, value)
          })
          console.log(dict.size)
          resolve(dict)
        }
      })
    })
  }
}
