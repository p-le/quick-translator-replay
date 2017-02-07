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
    const chars = [...text]
    chars.forEach((word, index) => {
      if (this.isChinese(word)) {

      }
    })
  }

  translateChinese (event, text) {
    const chars = [...text]
    const translatedChars = []

    chars.forEach((word) => {
      translatedChars.push(this.hanvietDict.get(word))
    })
    translatedChars[0].charAt(0).toUpperCase()

    event.sender.send('han', {
      han: translatedChars.join(' ')
    })
  }
  isChinese (word) {
    return this.hanvietDict.has(word)
  }

  isPhrase (phrase) {
    return this.phraseDict.has(phrase)
  }
}
