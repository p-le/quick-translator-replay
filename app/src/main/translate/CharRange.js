export default class CharRange {
  constructor (startIndex, length) {
    this.startIndex = startIndex
    this.length = length
    this.endIndex = startIndex + length - 1
  }

  getStartIndex () {
    return this.startIndex
  }

  getLength () {
    return this.length
  }

  getEndIndex () {
    return this.endIndex
  }

  isInRange (index) {
    return this.startIndex <= index && index <= this.endIndex
  }
}
