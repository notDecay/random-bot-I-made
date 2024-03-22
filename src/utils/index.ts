/**Sleep within specified time.
 *
 * @param delayInMiliseconds the delay in milliseconds. Defaults to `5` milliseconds.
 * @returns a `Promise` resolves *nothing*.
 */
export function sleep(delayInMiliseconds: number = 5) {
  return new Promise(resolve => setTimeout(resolve, delayInMiliseconds))
}

type ErrorStack = {
  /**The error's stack trace */
  stack: string
  /**The error's message. */
  message: string
}   

/**Parses an error object into an `ErrorStack` object with properties for the error's stack trace and message.
 *
 * @param error The error object to be parsed.
 * @returns An object containing the error's stack trace and message.
 * @see {@link ErrorStack}
 */
export function parseErrorStack(error: Error): ErrorStack {
  const thisError = JSON.stringify(error, Object.getOwnPropertyNames(error))
  return JSON.parse(thisError)
}

/**Type alias that can represent *any function*.
 * 
 * This type provides minimal type safety and should be used cautiously. 
 * Ideally, strive to define more specific function types to improve code clarity and maintainability.
 */
export type AnyFunction = (...args: any[]) => any

export * from "./command"
export * from "./embed"
export * from "./resources"
export * from "./voice"
export * from "./Queue"