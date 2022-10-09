let numbers = [3, 1, 2, 3, 7, 5, 6, 8, 2, 1]
let largest

function result(numbers) {
  const getLargestNumber = numbers.sort((a,b) => {
    return b - a
  })
  
  return getLargestNumber[0]
}

console.log(result(numbers))
