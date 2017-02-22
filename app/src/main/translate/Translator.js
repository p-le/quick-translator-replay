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
    this.punctuationDict = loader.loadPunctuationDict()
  }

  translateByModel (event, text) {
    return new Promise((resolve, reject) => {
      event.sender.send('translate/by/model', {
        status: true
      })
      const lines = text.split(/\r?\n/)
      const translatedMap = new Map()
      const tokenizedLines = []
      const tokenizedTranslateLines = []

      lines.map(line => {
        const tokens = this.segmenter.analyze(line).split(' ')
        const compoundTokensIndexMap = this.getCompoundTokensIndexMap(tokens)
        const tokenizedLine = []
        const tokenizedTranslateLine = []
        for (let i = 0; i < tokens.length; i++) {
          let nextTokenIndex = -1
          if (compoundTokensIndexMap.has(i)) {
            const indexs = compoundTokensIndexMap.get(i)
            for (let [a, b] of indexs) {
              const compoundToken = tokens.slice(a, b).join('')
              if (this.phraseDict.has(compoundToken)) {
                const translatedToken = this.phraseDict.get(compoundToken)
                translatedMap.set(compoundToken, translatedToken)
                tokenizedLine.push(compoundToken)
                tokenizedTranslateLine.push(translatedToken)
                nextTokenIndex = b - 1
              } else if (this.nameDict.has(compoundToken)) {
                const translatedToken = this.nameDict.get(compoundToken)
                translatedMap.set(compoundToken, translatedToken)
                tokenizedLine.push(compoundToken)
                tokenizedTranslateLine.push(translatedToken)
                nextTokenIndex = b - 1
              } else {
                if (a + 1 === b) {
                  const words = [...compoundToken]
                  words.map(word => {
                    let translatedWord = '???'
                    if (this.hanvietDict.has(word)) {
                      translatedWord = this.hanvietDict.get(word)
                    }
                    translatedMap.set(word, translatedWord)
                    tokenizedLine.push(word)
                    tokenizedTranslateLine.push(translatedWord)
                  })
                }
              }
              if (nextTokenIndex !== -1) {
                i = nextTokenIndex
                break
              }
            }
          } else {
            const words = [...tokens[i]]
            words.map(word => {
              let translatedWord = word
              if (this.punctuationDict.has(word.charCodeAt(0))) {
                const tmp = this.punctuationDict.get(word.charCodeAt(0))
                if (tmp instanceof Array) {
                  translatedWord = String.fromCharCode.apply(null, tmp)
                } else {
                  translatedWord = String.fromCharCode(tmp)
                }
              }
              tokenizedLine.push(word)
              tokenizedTranslateLine.push(translatedWord)
            })
          }
        }
        tokenizedLines.push(tokenizedLine)
        tokenizedTranslateLines.push(tokenizedTranslateLine)
      })
      resolve({
        tokenizedLines: tokenizedLines,
        tokenizedTranslateLines: tokenizedTranslateLines,
        map: translatedMap
      })
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

  getCompoundTokensIndexMap (tokens) {
    const result = new Map()
    tokens.map((token, i) => {
      if (!this.punctuationDict.has(token.charCodeAt(0))) {
        const compoundTokens = [[i, i + 1]]
        for (let j = i + 1; j < tokens.length; j++) {
          if (this.punctuationDict.has(tokens[j].charCodeAt(0))) break
          compoundTokens.push([i, j + 1])
        }
        compoundTokens.sort(([i1, j1], [i2, j2]) => j2 > j1)
        result.set(i, compoundTokens)
      }
    })
    return result
  }

  getSubTokens (text) {
    return new Promise((resolve, reject) => {
      resolve(this.segmenter.analyze(text).split(' ').filter(token => token.length > 0))
    })
  }
}
