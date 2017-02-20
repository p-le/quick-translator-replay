import { Dictionary } from './Dictionary'
import { IKArbitrator } from './IKArbitrator'
import { SegmenterUtil, CharType, LexemeType, Priority, Lexeme } from './SegmenterUtil'
import { DoubleLinkedList } from '../utils/DoubleLinkedList'

export class Segmenter {
  constructor (options) {
    this.options = options || {}
    this.input = ''
    this.inputCharTypes = []
    this.currentIndex = 0
    this.dictionary = new Dictionary()
    this.lexemes = new DoubleLinkedList()
    this.IKArbitrator = new IKArbitrator()
    this.english = {
      start: -1,
      end: -1
    }
    this.arabic = {
      start: -1,
      end: -1
    }
    this.letter = {
      start: -1,
      end: -1
    }
    this.cnum = {
      start: -1,
      end: -1
    }
    this.quantifier = {
      start: -1,
      end: -1,
      countHits: []
    }
    this.cjk = {
      hits: []
    }
  }

  reset (input) {
    this.input = input
    this.inputCharTypes = [...input].map(char => {
      char = SegmenterUtil.normalize(char)
      return SegmenterUtil.getCharType(char)
    })
    this.currentIndex = 0
  }

  analyze (input) {
    if (!input) return input
    this.reset(input)
    while (this.currentIndex < this.input.length) {
      this.parseLetter()
      // this.parseQuantifer()
      this.parseCJK()
      this.currentIndex++
    }
    this.IKArbitrator.process()
    return this.toResult()
  }

  parseLetter () {
    const LETTER_CONNECTOR = ['#', '&', '+', '-', '.', '@', '_']
    const charType = this.inputCharTypes[this.currentIndex]

    if (charType === CharType.ENGLISH) {
      this.english.start = (this.english.start === -1) ? this.currentIndex : this.english.start
      this.english.end = this.currentIndex
    } else {
      if (this.english.start !== -1) {
        const lexeme = new Lexeme(this.english.start, this.english.end, LexemeType.ENGLISH)
        console.log(`English: ${lexeme}`)
        this.addLexeme(lexeme)
        this.english.start = -1
        this.english.end = -1
      }
    }

    if (charType !== CharType.USELESS && !LETTER_CONNECTOR.includes(this.input[this.currentIndex])) {
      if (charType === CharType.ARABIC) {
        this.arabic.start = (this.arabic.start === -1) ? this.currentIndex : this.arabic.start
        this.arabic.end = this.currentIndex
      } else {
        if (this.arabic.start !== -1) {
          const lexeme = new Lexeme(this.arabic.start, this.arabic.end, LexemeType.ARABIC)
          console.log(`Arabic: ${lexeme}`)
          this.addLexeme(lexeme)
          this.arabic.start = -1
          this.arabic.end = -1
        }
      }
    }

    if (charType === CharType.ARABIC || charType === CharType.ENGLISH) {
      this.letter.start = (this.letter.start === -1) ? this.currentIndex : this.letter.start
      this.letter.end = this.currentIndex
    } else if (charType === CharType.USELESS || LETTER_CONNECTOR.includes(this.input[this.currentIndex])) {
      this.letter.end = this.currentIndex
    } else {
      if (this.letter.start !== -1) {
        const lexeme = new Lexeme(this.letter.start, this.letter.end, LexemeType.LETTER)
        console.log(`Letter: ${lexeme}`)
        this.addLexeme(lexeme)
        this.letter.start = -1
        this.letter.end = -1
      }
    }
  }

  parseQuantifier () {
    const CNUM = '０１２３４５６７８９〇一二两三四五六七八九十零壹贰叁肆伍陆柒捌玖拾百佰千仟万萬亿億拾佰仟萬亿億兆卅廿'

    const charType = this.inputCharTypes[this.currentIndex]
    if ([CharType.CHINESE, CharType.ARABIC].includes(charType) &&
      CNUM.indexOf(this.input[this.currentIndex]) > -1) {
      this.quantifier.start = (this.quantifier.start === -1) ? this.currentIndex : this.quantifier.start
      this.quantifier.end = this.currentIndex
    } else {
      if (this.quantifier.start !== -1) {
        const lexeme = new Lexeme(this.quantifier.start, this.quantifier.end, LexemeType.CNUM)
        this.lexemes.add(lexeme)
        this.quantifier.start = -1
        this.cnquantifierum.end = -1
      }
    }

    if (charType === CharType.CHINESE) {

    } else {
      this.quantifier.countHits = []
      const hit = this.dictionary.quantifierDict.getNode(this.input[this.currentIndex])
      if (hit.isMatch()) {
        const lexeme = new Lexeme(this.currentIndex, this.currentIndex + 1, LexemeType.COUNT)
        this.addLexeme(lexeme)
      }
    }
  }

  parseCJK () {
    console.log('*****')
    const charType = this.inputCharTypes[this.currentIndex]
    if (charType !== CharType.USELESS) {
      console.log(this.input[this.currentIndex])
      const currentHit = Dictionary.matching(
        this.dictionary.mainDict,
        this.input,
        this.currentIndex,
        this.currentIndex + 1
      )

      const additionalHits = []
      this.cjk.hits.map(oldHit => {
        const additionalHit = Dictionary.matching(
          this.dictionary.mainDict,
          this.input,
          oldHit.begin,
          this.currentIndex + 1
        )
        console.log('Addition: ' + JSON.stringify(additionalHit))
        if (additionalHit.isMatch()) {
          const lexeme = new Lexeme(oldHit.begin, additionalHit.end, LexemeType.CNUM)
          console.log(JSON.stringify(lexeme))
        }
        if (additionalHit.isPrefix()) {
          additionalHits.push(additionalHit)
        }
      })
      this.cjk.hits = additionalHits

      console.log(JSON.stringify(currentHit))
      if (currentHit.isMatch()) {
        const lexeme = new Lexeme(currentHit.begin, currentHit.end, LexemeType.CNWORD)
        console.log(JSON.stringify(lexeme))
      }
      if (currentHit.isPrefix()) {
        this.cjk.hits.push(currentHit)
      }
    } else {
      this.cjk.hits = []
    }
    console.log(this.cjk.hits)
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
          this.lexemes.pop()
          this.addLexeme(newLexeme)
          break
      }
    }
  }

  toResult () {

  }
}
