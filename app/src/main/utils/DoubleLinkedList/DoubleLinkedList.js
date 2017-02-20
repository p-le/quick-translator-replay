import { DoubleLinkedListNode } from './DoubleLinkedListNode'

export class DoubleLinkedList {
  constructor () {
    this.length = 0
    this.head = null
    this.tail = null
  }

  add (data) {
    const node = new DoubleLinkedListNode(data)
    if (this.length === 0) {
      this.head = node
      this.tail = node
    } else {
      this.tail.next = node
      node.prev = this.tail
      this.tail = node
    }
    this.length++
  }

  insertAfter (targetNode, data) {
    const newNode = new DoubleLinkedListNode(data)
    newNode.prev = targetNode
    if (!targetNode.next) {
      this.tail = newNode
    } else {
      newNode.next = targetNode.next
      targetNode.next.prev = newNode
    }
    targetNode.next = newNode
  }

  insertBefore (targetNode, data) {
    const newNode = new DoubleLinkedListNode(data)
    newNode.next = targetNode
    if (!targetNode.prev) {
      this.head = newNode
    } else {
      newNode.prev = targetNode.prev
      targetNode.prev.next = newNode
    }
    targetNode.prev = newNode
  }

  remove (node) {
    if (!node.prev) {
      this.head = node.next
    } else if (!node.next) {
      this.tail = node.prev
    } else {
      node.prev.next = node.next
      node.next.prev = node.prev
    }
  }

  pop () {
    const node = this.tail
    this.tail.prev.next = null
    this.tail = this.tail.prev
    this.length--
    return node
  }

  concat (list) {
    this.tail.next = list.head
    this.tail = list.tail
  }

  traverseForward (callback) {
    let node = this.head
    while (node) {
      callback(node)
      node = node.next
    }
  }

  traverseBackward (callback) {
    let node = this.tail
    while (node) {
      callback(node)
      node = node.prev
    }
  }
}
