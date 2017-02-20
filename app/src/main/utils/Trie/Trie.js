import { TrieNode } from './TrieNode'
export class Trie {
  constructor () {
    this.root = new TrieNode()
  }
  insert (word) {
    let childs = this.root.childs
    const chars = [...word]
    chars.forEach((char, index) => {
      let childNode
      if (childs[char]) {
        childNode = childs[char]
      } else {
        childNode = new TrieNode()
        childs[char] = childNode
      }
      childs = childNode.childs
      if (index === chars.length) {
        childNode.isLeaf = true
      }
    })
  }

  getNode (word) {
    const chars = [...word]
    let current = this.root
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      if (!current.childs[char]) return null
      current = current.childs[char]
    }
    return current
  }

  static from (words) {
    const trie = new Trie()
    words.forEach(word => {
      trie.insert(word)
    })
    return trie
  }
}
