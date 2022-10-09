function result() {
	const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	const today = new Date()
  const daysAgo = new Date(today.getTime())

  daysAgo.setDate(today.getDate() - 4)
  
  return `1. if date now = ${days[today.getDay()]} \n 2. then result = ${days[daysAgo.getDay()]}`
}

console.log(result())
