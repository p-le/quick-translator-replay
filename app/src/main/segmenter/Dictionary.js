import { Trie } from '../utils/Trie'
import { Hit, HitState } from './SegmenterUtil'
import * as fs from 'fs'

const MAIN_DIC_PATH = `${__dirname}/dict/main.dic`
const PREPOSITION_DIC_PATH = `${__dirname}/dict/preposition.dic`
const QUANTIFIER_DIC_PATH = `${__dirname}/dict/quantifier.dic`
const STOPWORD_DIC_PATH = `${__dirname}/dict/stopword.dic`
const SUFFIX_DIC_PATH = `${__dirname}/dict/suffix.dic`
const SURNAME_DIC_PATH = `${__dirname}/dict/surname.dic`

export class Dictionary {
  constructor () {
    Promise.all(this.loadDict([
      MAIN_DIC_PATH,
      PREPOSITION_DIC_PATH,
      QUANTIFIER_DIC_PATH,
      STOPWORD_DIC_PATH,
      SUFFIX_DIC_PATH,
      SURNAME_DIC_PATH
    ])).then(([mains, prepositions, quantifiers, stopWords, suffixs, surnames]) => {
      this.mainDict = Trie.from(mains)
      this.prepositionDict = Trie.from(prepositions)
      this.quantifierDict = Trie.from(quantifiers)
      this.stopWordDict = Trie.from(stopWords)
      this.suffixDict = Trie.from(suffixs)
      this.surnameDict = Trie.from(surnames)
      console.log(this)
    },
    (reason) => console.log(reason))
  }

  loadDict (paths) {
    return paths.map(path => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
          if (err) reject(err)
          else {
            data = data.replace(/ |\r/g, '').split('\n')
            resolve(data)
          }
        })
      })
    })
  }

  static matching (dict, input, begin, end) {
    const hit = new Hit()
    hit.begin = begin
    hit.end = end
    const result = dict.getNode(input.slice(begin, end))
    if (result) {
      console.log('childs: ' + Object.keys(result.childs).length)
      if (Object.keys(result.childs).length > 0) {
        hit.state = HitState.PREFIX
      } else {
        hit.state = HitState.MATCH
      }
    }

    return hit
  }
}
