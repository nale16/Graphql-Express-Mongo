const data = { i: 6, j: null, k: 3, l: 12 }

function result(data) {
  const result = Object.keys(data)
    .sort((a, b) => {
    	return data[a] - data[b]
    })
    .reduce(
      (_sortedObj, key) => ({
        ..._sortedObj,
        [key]: data[key] * 3
      }),
      {}
    )
    
  return JSON.stringify(result)
}

console.log(result(data))
