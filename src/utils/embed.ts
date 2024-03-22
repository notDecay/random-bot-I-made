/**Formats a date as an ISO 8601 string.
 * 
 * And... that's just a short-hand of 
 * ```
 * new Date().toISOString()
 * ```
 *
 * @returns The formatted date string.
 */
export function formatEmbedDate() {
  return new Date().toISOString()
}