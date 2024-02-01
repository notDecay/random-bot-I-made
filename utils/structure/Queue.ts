export default class Queue<T> {
  protected elements: any[] = []
  enqueue(element: T) {
    this.elements.push(element)
  }

  dequeue(): T | undefined {
    return this.elements.shift()
  }
  
  get length() {
    return this.elements.length
  }

  get isEmpty() {
    return this.length === 0
  }
}