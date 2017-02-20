import { DoubleLinkedList } from '../utils/DoubleLinkedList'

export const LexemeType = {
  UNKNOWN: 0,
  ENGLISH: 1,
  ARABIC: 2,
  LETTER: 3,
  CNWORD: 4,
  CNCHAR: 64,
  OTHER_CJK: 8,
  CNUM: 16,
  COUNT: 32,
  CQUAN: 48
}

export const CharType = {
  USELESS: 0,
  ARABIC: 1,
  ENGLISH: 2,
  CHINESE: 4,
  OTHER_CJK: 8
}

export const Priority = {
  UNPREFERED: -1,
  SAME: 0,
  PREFERED: 1
}

export const HitState = {
  UNMATCH: 0,
  MATCH: 1,
  PREFIX: 2,
  MATCH_N_PREFIX: 3
}

export class Hit {
  constructor () {
    this.state = HitState.UNMATCH
    this.begin = 0
    this.end = 0
  }

  isMatch () {
    return this.state === HitState.MATCH
  }

  isPrefix () {
    return this.state === HitState.PREFIX
  }

  isUnmatch () {
    return this.state === HitState.UNMATCH
  }

  isMatchNPrefix () {
    return this.state === HitState.MATCH_N_PREFIX
  }
}

export class Lexeme {
  constructor (begin, end, type) {
    this.begin = begin
    this.end = end
    this.type = type
  }

  static compare (l1, l2) {
    let result = Priority.UNPREFERED

    if (l1.begin < l2.begin) {
      return Priority.PREFERED
    } else if (l1.begin === l2.begin) {
      if (l1.end > l2.end) {
        return Priority.PREFERED
      } else if (l1.end === l2.end) {
        return Priority.SAME
      }
    }
    return result
  }

  static prioritize (lexemeList, newLexeme) {
    if (lexemeList.length === 0) {
      lexemeList.add(newLexeme)
    } else {
      const priority = Lexeme.compare(lexemeList.tail.data, newLexeme)
      switch (priority) {
        case Priority.PREFERED:
          console.log('PREFERED')
          lexemeList.add(newLexeme)
          break
        case Priority.SAME:
          console.log('SAME')
          break
        case Priority.UNPREFERED:
          console.log('UNPREFERED')
          // lexemeList.pop()
          // this.prioritizeLexeme(newLexeme)
          break
      }
    }
  }

  static compound () {
    console.log('compound')
  }
}

export class LexemePath {
  constructor () {
    this.lexemes = new DoubleLinkedList()
    this.begin = -1
    this.end = -1
    this.payload = 0
  }

  static isCross (lexemePath, lexeme) {
    return ((lexemePath.begin < lexeme.begin && lexeme.begin < lexemePath.end) ||
      (lexemePath.begin >= lexeme.begin && lexemePath.begin < lexeme.end))
  }

  static addCrossLexeme (lexemePath, lexeme) {
    let result = false
    if (lexemePath.lexemes.length === 0) {
      Lexeme.prioritize(lexemePath.lexemes, lexeme)
      lexemePath.begin = lexeme.begin
      lexemePath.end = lexeme.end
      lexemePath.payload += lexeme.begin - lexeme.end
      result = true
    } else if (LexemePath.isCross(lexemePath, lexeme)) {
      Lexeme.prioritize(LexemePath.lexemes, lexeme)
      if (lexeme.end > lexemePath.end) {
        lexemePath.end = lexeme.end
      }
      lexemePath.payload = lexemePath.end - lexemePath.begin
      result = true
    }
    return result
  }

  static judge (lexemePath, lexeme) {

  }
}

export class SegmenterUtil {
  static getCharType (char) {
    let type = CharType.USELESS
    if ((char >= '0' && char <= '9')) {
      type = CharType.ARABIC
    } else if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      type = CharType.ENGLISH
    } else {
      type = CharType.CHINESE
      const charCode = char.charCodeAt(0)
      if ((charCode >= 0x3400 && charCode <= 0x4DBF) || // CJK Unified Ideographs Extension A
          (charCode >= 0x4E00 && charCode <= 0x9FFF) || // CJK Unified Ideographs
          (charCode >= 0xF900 && charCode <= 0xFAFF)) {  // CJK Compatibility Ideographs
        type = CharType.CHINESE
      } else if ((charCode >= 0xFF00 && charCode <= 0xFFEF) || // Halfwidth and Fullwidth Forms 全角数字字符和日韩字符
        (charCode >= 0x1100 && charCode <= 0x11FF) || // Hangul Jamo
        (charCode >= 0x3130 && charCode <= 0x318F) || // Hangul Compatibility Jamo
        (charCode >= 0xA960 && charCode <= 0xA97F) || // Hangul Jamo Extended-A
        (charCode >= 0xAC00 && charCode <= 0xD7AF) || // Hangul Syllables
        (charCode >= 0xD7B0 && charCode <= 0xD7FF) ||  // Hangul Jamo Extended-B
        (charCode >= 0x3040 && charCode <= 0x309F) || // Hiragana 平假名
        (charCode >= 0x30A0 && charCode <= 0x30FF) || // KATAKANA 片假名
        (charCode >= 0x31F0 && charCode <= 0x31FF)) { // Katakana Phonetic Extensions
        type = CharType.OTHER_CJK
      }
    }
    return type
  }

  static normalize (char) {
    let code = char.charCodeAt(0)
    if (code === 12288) {
      char = ' '
    } else if (code > 65280 && code < 65375) {
      char = String.fromCharCode(code - 65248)
      if ((char >= 'A' && char <= 'Z')) {
        code = char.charCodeAt(0)
        char = String.fromCharCode(code + 32)
      }
    } else if ((char >= 'A' && char <= 'Z')) {
      char = String.fromCharCode(code + 32)
    }
    return char
  }

}
