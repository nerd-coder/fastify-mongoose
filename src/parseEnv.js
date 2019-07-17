/**
 * @template T
 * @param {string} key
 * @param {T} defaultVal
 * @returns {T}
 */
module.exports = function parseEnv(key = '', defaultVal) {
  if (typeof key !== 'string') throw new Error('key must be a string')

  const envValue = process.env[key.toUpperCase()]

  if (typeof defaultVal === 'number')
    return isNaN(Number(envValue)) ? defaultVal : Number(envValue)
  if (typeof defaultVal === 'boolean')
    return typeof envValue === 'undefined' ? defaultVal : Boolean(envValue)
  if (typeof defaultVal === 'string')
    return typeof envValue === 'undefined' ? defaultVal : envValue

  throw new Error('default value must be string or number')
}
