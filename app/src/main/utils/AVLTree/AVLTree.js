import { AVLTreeNode } from './AVLTreeNode'

const BalanceState = {
  LEFT_LEFT: 1,
  RIGHT_RIGHT: 2,
  LEFT_RIGHT: 3,
  RIGHT_LEFT: 4
}

export class AVLTree {
  constructor () {
    this.root = null
  }

  insert (data) {
    console.log(data)
    const newNode = new AVLTreeNode(data)
    if (!this.root) {
      newNode.height = 1
      this.root = newNode
    } else {
      let currentNode = this.root
      while (currentNode) {
        newNode.height++
        if (newNode.data > currentNode.data) {
          if (!currentNode.right) {
            currentNode.right = newNode
          }
          currentNode = currentNode.right
        } else if (newNode.data < currentNode.data) {
          if (!currentNode.left) {
            currentNode.left = newNode
          }
          currentNode = currentNode.left
        } else {
          break
        }

        const balanceState = this.getBalanceState(currentNode)
        switch (balanceState) {
          case BalanceState.LEFT_LEFT:
            break
          case BalanceState.RIGHT_RIGHT:
            break
          case BalanceState.LEFT_RIGHT:
            break
          case BalanceState.RIGHT_LEFT:
            break
        }
      }
    }
  }

  getHeight (node) {
    return (node) ? node.height : 0
  }

  getBalanceState (node, data) {
    const balance = this.getHeight(node.left) - this.getHeight(node.right)
    if (balance > 1 && data < node.left.data) {
      return BalanceState.LEFT_LEFT
    }
  }

  // ON RIGHT SIDE
  rotateRight (targetNode) {
    const leftNode = targetNode.left
    const rightOfLeftNode = leftNode.right

    leftNode.right = targetNode
    targetNode.left = rightOfLeftNode

    return leftNode
  }

  // ON LEFT SIDE
  rotateLeft (targetNode) {
    const rightNode = targetNode.right
    const leftOfRightNode = rightNode.left

    rightNode.left = targetNode
    targetNode.right = leftOfRightNode

    return rightNode
  }

  traverse () {

  }

  static from (list) {
    const avlTree = new AVLTree()
    list.forEach(item => avlTree.insert(item))
    return avlTree
  }
}
