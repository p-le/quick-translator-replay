import { Loader } from './Loader'
const RakutenMA = require('rakutenma')

export class Translator {
  constructor () {
    const loader = new Loader()

    loader.loadModel().then(model => {
      this.rma = new RakutenMA(JSON.parse(model))
      this.rma.featset = RakutenMA.default_featset_zh
      this.rma.hash_func = RakutenMA.create_hash_func(15)
      loader.loadChardict().then(chardict => {
        this.rma.ctype_func = RakutenMA.create_ctype_chardic_func(JSON.parse(chardict))
      })
    })

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
    const translatedTokens = []
    const tokenPairs = this.rma.tokenize(text)
    console.log(tokenPairs)
    const maxLength = tokenPairs.length

    for (let i = 0; i < maxLength; i++) {
      let isBiggerTokenExist = false

      // for (let j = tokenPairs.length; j > i; j--) {
      //   const biggerToken = tokenPairs.slice(i, j).map(tokenPair => tokenPair[0]).join('')
      //   if (this.nameDict.has(biggerToken)) {
      //     translatedTokens.push(this.nameDict.get(biggerToken))
      //     console.log(biggerToken, 'bigger name')
      //     isBiggerTokenExist = true
      //   } else if (this.phraseDict.has(biggerToken)) {
      //     translatedTokens.push(this.phraseDict.get(biggerToken))
      //     console.log(biggerToken, 'bigger phrase')
      //     isBiggerTokenExist = true
      //   }

      //   if (isBiggerTokenExist) {
      //     i += j
      //     break
      //   }
      // }

      if (isBiggerTokenExist) continue

      const [token, type] = tokenPairs[i]
      console.log(token, type)
      const words = [...token]
      if (type === '') {
        words.map(word => {
          if (this.hanvietDict.has(word)) {
            translatedTokens.push(this.captilize(this.hanvietDict.get(word)))
          }
        })
      } else {
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
      }
    }

    event.sender.send('model', {
      onemeaning: translatedTokens.join(' ')
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

  captilize (word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
}
