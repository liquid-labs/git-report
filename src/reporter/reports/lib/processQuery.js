const checkValues = (queryKey, queryValue, params, valueRegex) => {
  if (!queryValue.match(valueRegex)) {
    throw new Error(`Invalid query values '${queryValue}' for query key '${queryKey}'`)
  }
}

const processQuery = (queryString, params, validOptions) => {
  if (queryString && queryString.length > 0) {
    const queryChunks = queryString.split(/\s*;\s*/)
    for (const queryChunk of queryChunks) {
      const [ queryKey, queryValue ] = queryString.split(/\s*:\s*/)
      
      const queryKeyLc = queryKey.toLowerCase()
      if (validOptions[queryKeyLc]) {
        const validValues = validOptions[queryKeyLc]
        const valueRegex = new RegExp(`(${validValues.join('|')})`, 'i')
        checkValues(queryKeyLc, queryValue, params, valueRegex)
        params[queryKey] = queryValue
      }
      else if (validOptions[`${queryKeyLc}[]`]) {
        const validValues = validOptions[`${queryKeyLc}[]`]
        const valueRegex = new RegExp(`(${validValues.join('|')}(,${validValues.join('|')})*)`, 'i')
        checkValues(queryKeyLc, queryValue, params, valueRegex)
        params[queryKey] = queryValue.split(/\s*,\s*/)
      }
      else {
        throw new Error(`Invalid query key '${queryKey}'.`)
      }
    }
  }
}

export { processQuery }
