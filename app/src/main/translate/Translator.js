import { Loader } from './Loader'

export class Translator {
  constructor () {
    const loader = new Loader()
    this.hanvietDict = new Map()
    loader.loadHanVietDict().then(dict => {
      this.hanvietDict = dict
      return dict
    })
    loader.loadPhraseDict().then(dict => {
      this.phraseDict = dict
      return dict
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

    event.sender.send('han', {
      han: translatedLines.join('\r\n')
    })
  }
  isChinese (word) {
    return this.hanvietDict.has(word)
  }

  isPhrase (phrase) {
    return this.phraseDict.has(phrase)
  }
}
