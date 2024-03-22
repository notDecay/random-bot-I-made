/**A FIFO (First-In-First-Out) queue. 
 * @template BasicallyAnything yep, you know what that mean. Any types.
 * @class
 */
export class Queue<BasicallyAnything> {
  /**The underlying array that stores the queue elements.
   * @protected
   */
  protected elements: BasicallyAnything[] = []

  /**Adds an element to the back of the queue.
   * @param element The element to enqueue.
   */
  enqueue(element: BasicallyAnything) {
    this.elements.push(element)
  }

  /**Removes and returns the element at the front of the queue.
   * @returns The dequeued element or `undefined` if the queue is empty.
   */
  dequeue(): BasicallyAnything | undefined {
    return this.elements.shift()
  }

  /**Removes all elements from the queue. */
  clear() {
    this.elements = []
  }

  /**The number of elements in the queue.
   * @readonly
   */
  get length() {
    return this.elements.length
  }

  /**Whether the queue is empty.
   * @readonly
   */
  get isEmpty() {
    return this.length === 0
  }
}