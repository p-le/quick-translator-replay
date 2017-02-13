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
    this.punctuations = [ 8220, 8221, 8230, 12290, 65292, 65311, '\'', ';', ':', '！', '.', '）', '（' ]
  }

  translateByModel (event, text) {
    return new Promise((resolve, reject) => {
      event.sender.send('translate/by/model', {
        status: true
      })
      const lines = text.split(/\r?\n/)
      let translatedLines = lines
      const translatedMap = new Map()

      translatedLines = translatedLines.map(translatedLine => {
        const tokens = this.segmenter.analyze(translatedLine).split(' ')
        const compoundTokensIndexMap = this.getCompoundTokensIndexMap(tokens)

        for (let i = 0; i < tokens.length; i++) {
          let nextTokenIndex = -1
          if (compoundTokensIndexMap.has(i)) {
            const indexs = compoundTokensIndexMap.get(i)
            console.log(indexs)
            for (let [a, b] of indexs) {
              const compoundToken = tokens.slice(a, b).join('')
              console.log(compoundToken)
              if (this.phraseDict.has(compoundToken)) {
                const translatedToken = this.phraseDict.get(compoundToken)
                translatedMap.set(compoundToken, translatedToken)
                translatedLine = translatedLine.replace(compoundToken, ' ' + translatedToken)
                nextTokenIndex = b - 1
              } else if (this.nameDict.has(compoundToken)) {
                const translatedToken = this.nameDict.get(compoundToken)
                translatedMap.set(compoundToken, translatedToken)
                translatedLine = translatedLine.replace(compoundToken, ' ' + translatedToken)
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
                    translatedLine = translatedLine.replace(word, ' ' + translatedWord)
                  })
                }
              }
              if (nextTokenIndex !== -1) {
                console.log(translatedLine)
                i = nextTokenIndex
                break
              }
            }
          } else {
            const words = [...tokens[i]]
            words.map(word => {
              translatedMap.set(word, word)
              translatedLine = translatedLine.replace(word, ' ' + word)
            })
          }
        }
        return translatedLine
      })

      resolve({
        lines: translatedLines,
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
      if (this.punctuations.indexOf(token.charCodeAt(0)) === -1) {
        const compoundTokens = [[i, i + 1]]
        for (let j = i + 1; j < tokens.length; j++) {
          if (this.punctuations.indexOf(tokens[j].charCodeAt(0)) > -1) break
          compoundTokens.push([i, j + 1])
        }
        compoundTokens.sort(([i1, j1], [i2, j2]) => j2 > j1)
        console.log(compoundTokens)
        result.set(i, compoundTokens)
      }
    })
    return result
  }
}
