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

  translate (event, text) {
    const chars = [...text]
    chars.forEach((word, index) => {
      if (this.isChinese(word)) {

      }
    })
  }

  isChinese (word) {
    return this.hanvietDict.has(word)
  }

  isPhrase (phrase) {
    return this.phraseDict.has(phrase)
  }
}
