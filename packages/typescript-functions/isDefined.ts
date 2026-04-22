/**
 * @param t parameter to check if it is defined
 * @returns if @param is defined
 */
const isDefined = <T>(t: T | undefined): t is T => t !== undefined;

export { isDefined };
