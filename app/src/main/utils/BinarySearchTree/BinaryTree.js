import { Node } from './Node'

export class BinarySearchTree {
  constructor (compare) {
    this.root = null
    this.compare = compare
  }
  add (data) {
    const node = new Node(data)
    if (!this.root) {
      this.root = node
    } else {
      let currentNode = this.root
      while (currentNode) {
        if (this.compare(node.data, currentNode.data) > 0) {
          if (!currentNode.left) {
            currentNode.left = node
          }
          currentNode = currentNode.left
        } else if (this.compare(node.data, currentNode.data) < 0) {
          if (!currentNode.right) {
            currentNode.right = node
          }
          currentNode = currentNode.right
        } else {
          break
        }
      }
    }
  }
}
