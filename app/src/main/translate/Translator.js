import { Loader } from './Loader'
const Segmenter = require('node-analyzer')

export class Translator {
  constructor () {
    const loader = new Loader()
    this.segmenter = new Segmenter()

    loader.loadHanVietDict().then(dict => {
      this.hanvietDict = dict
    })

    loader.loadPhraseDict().then(dict => {
      this.phraseDict = dict
    })

    loader.loadNameDict().then(dict => {
      this.nameDict = dict
    })
  }

  translateByModel (event, text) {
    return new Promise((resolve, reject) => {
      event.sender.send('translate/by/model', {
        status: true
      })
      setTimeout(() => {
        const tokens = this.segmenter.analyze(text).split(' ')
        console.log(tokens)
        const translatedTokens = []
        tokens.map(token => {
          const words = [...token]
          if (this.phraseDict.has(token)) {
            translatedTokens.push(this.phraseDict.get(token))
            console.log(token, 'phrase')
          } else if (this.nameDict.has(token)) {
            translatedTokens.push(this.nameDict.get(token))
            console.log(token, 'name')
          } else {
            console.log(token, 'han')
            words.map(word => {
              if (this.hanvietDict.has(word)) {
                translatedTokens.push(this.captilize(this.hanvietDict.get(word)))
              }
            })
          }
        })
        resolve(translatedTokens)
      }, 5000)
    })
  }

  translatePhraseMultiMeaning (event, text) {
    const chars = [...text]
    chars.forEach((word, index) => {
      if (this.isChinese(word)) {

      }
    })
  }

  translatePhraseOneMeaning (event, text) {
    const lines = text.split(/\r?\n/)
    const translatedLines = []
    // const translatedLines = []

    lines.map(line => {
      const words = [...line]
      const parts = []
      let tmpPart = []

      // split lines to parts of words
      words.map((word, index) => {
        if (this.isChinese(word)) {
          tmpPart.push(word)
        } else {
          parts.push(tmpPart)
          parts.push(word)
          tmpPart = []
        }
      })

      // translate by part
      const translatedParts = []
      parts.map(part => {
        const maxIndex = part.length - 1
        if (part instanceof Array) {
          const translatedPart = []
          for (let i = 0; i < maxIndex; i++) {
            for (let j = maxIndex; j > 0; j--) {
              const phrase = part.slice(i, j).join('')
              if (this.phraseDict.has(phrase)) {
                translatedPart.push(this.phraseDict.get(phrase))
                i += j
                break
              }
            }
          }
          translatedParts.push(translatedPart.join(' '))
        } else {
          translatedParts.push(part)
        }
      })
      translatedLines.push(translatedParts.join(' '))
    })
    event.sender.send('onemeaning', {
      onemeaning: translatedLines.join('\r\n')
    })
  }

  translateChinese (event, text) {
    return new Promise((resolve, reject) => {
      event.sender.send('translate/by/ZhVn', {
        status: true
      })
      const lines = text.split(/\r?\n/)
      const translatedLines = []
      lines.map(line => {
        const words = [...line]
        const translatedWords = []
        words.forEach((word) => {
          if (this.isChinese(word)) {
            translatedWords.push(this.hanvietDict.get(word))
          } else {
            translatedWords.push(word)
          }
        })
        translatedLines.push(translatedWords.join(' '))
      })

      resolve(translatedLines)
    })
  }

  isChinese (word) {
    return this.hanvietDict.has(word)
  }

  isPhrase (phrase) {
    return this.phraseDict.has(phrase)
  }

  captilize (word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
}
