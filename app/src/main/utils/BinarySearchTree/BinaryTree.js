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

  contains (data) {
    let isFound = false
    let currentNode = this.root
    while (!isFound && currentNode) {
      if (this.compare(data, currentNode.data) < 0) {
        currentNode = currentNode.left
      } else if (this.compare(data, currentNode.data) > 0) {
        currentNode = currentNode.right
      } else {
        isFound = true
      }
    }
    return isFound
  }

  traverseDFS (callback) {
    const inOrder = (node) => {
      if (node.left) inOrder(node.left)
      callback.call(this, node)
      if (node.right) inOrder(node.right)
    }
    inOrder(this.root)
  }

  traverseBFS (callback) {
    //
  }

  remove (data) {

  }

  size () {
    let length = 0
    this.traverseDFS((node) => length++)
    return length
  }

  toArray () {
    const result = []
    this.traverseDFS((node) => result.push(node.data))
    return result
  }
}
