import { Dictionary } from './Dictionary'
import { SegmenterUtil, CharType, Priority, Lexeme } from './SegmenterUtil'
import { LetterParser } from './LetterParser'
import { DoubleLinkedList } from '../utils/DoubleLinkedList'

export class Segmenter {
  constructor (options) {
    this.options = options || {}
    this.input = ''
    this.inputCharTypes = []
    this.currentIndex = 0
    this.maxIndex = 0
    this.dictionary = new Dictionary()
    this.parsers = [new LetterParser()]
    this.lexemes = new DoubleLinkedList()
  }

  reset (input) {
    this.input = input
    this.currentIndex = 0
    this.maxIndex = input.length
    this.inputCharTypes = [...input].map(char => {
      char = SegmenterUtil.normalize(char)
      return SegmenterUtil.getCharType(char)
    })
  }

  analyze (input) {
    if (!input) return input
    this.reset(input)
    while (this.currentIndex < this.maxIndex) {
      this.parseLetter()
      this.currentIndex++
    }
    return ''
  }

  parseLetter () {
    const LETTER_CONNECTOR = ['#', '&', '+', '-', '.', '@', '_']
    const charType = this.inputCharTypes[this.currentIndex]

    if (charType === CharType.ARABIC || charType === CharType.ENGLISH) {

    } else if (charType === CharType.USELESS || LETTER_CONNECTOR.includes(this.input[this.currentIndex])) {

    } else {
      const lexeme = new Lexeme()
      this.addLexeme(lexeme)
    }
  }

  addLexeme (newLexeme) {
    if (this.lexemes.length === 0) {
      this.lexemes.add(newLexeme)
    } else {
      const priority = Lexeme.compare(this.lexemes.tail, newLexeme)

      switch (priority) {
        case Priority.PREFERED:
          this.lexemes.add(newLexeme)
          break
        case Priority.SAME: break
        case Priority.UNPREFERED:
          this.lexemes.insertBefore(this.lexemes.head, newLexeme)
          break
      }
    }
  }
}
