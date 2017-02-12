import { Loader } from './Loader'

export class DictFinder {
  constructor () {
    const loader = new Loader()

    loader.loadLacVietDict().then(dict => {
      this.lacvietDict = dict
    })

    loader.loadBabylonDict().then(dict => {
      this.babylonDict = dict
    })

    loader.loadThieuChuuDict().then(dict => {
      this.thieuChuuDict = dict
    })
  }

  findLacVietDict (text) {
    return new Promise((resolve, reject) => {
      const words = [...text]
      for (let i = 0; i < words.length; i++) {
        console.log(words[i])
      }
      resolve(this.lacvietDict.get(text))
    })
  }

  findBabylonDict (text) {
    return new Promise((resolve, reject) => {
      resolve(this.babylonDict.get(text))
    })
  }

  findThieuChuuDict (text) {
    return new Promise((resolve, reject) => {
      resolve(this.thieuChuuDict.get(text))
    })
  }
}
