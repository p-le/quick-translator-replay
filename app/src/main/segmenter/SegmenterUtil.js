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
  PREFIX: 2
}

export class Hit {
  constructor () {
    this.trieNode = null
    this.state = HitState.UNMATCH
    this.begin = 0
    this.end = 0
  }

  isMatch () {
    return (this.state & HitState.MATCH) > 0
  }

  isPrefix () {
    return (this.state & HitState.PREFIX) > 0
  }

  isUnmatch () {
    return this.state === HitState.UNMATCH
  }
}

export class Lexeme {
  constructor (type, begin, end) {
    this.type = type
    this.begin = begin
    this.end = end
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
