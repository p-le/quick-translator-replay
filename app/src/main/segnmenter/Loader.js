const fs = require('fs')

const mainDictPath = 'dicts/parse/main.dic'
const surnameDictPath = 'dicts/parse/surname.dic'
const quantifierDictPath = 'dicts/parse/quantifier.dic'
const suffixDictPath = 'dicts/parse/suffix.dic'
const prepositionDictPath = 'dicts/parse/preposition.dic'
const stopDictPath = 'dicts/parse/stopword.dic'

export class Loader {
  loadMainDict () {
    return new Promise((resolve, reject) => {
      fs.readFile(mainDictPath, 'utf-8', (err, data) => {
        if (err) reject(err)
        else {
          data.replace(/ |\r/g, '')
          data = data.split(/\r?\n/)
          resolve(data)
        }
      })
    })
  }
}