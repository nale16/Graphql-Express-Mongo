const students = [
  { firstName: 'Kai', lastName: 'Lyons' },
  { firstName: 'Belle', lastName: 'Norton' },
  { firstName: 'Finnley', lastName: 'Rennie' },
  { firstName: 'Tatiana', lastName: 'Dickerson' },
  { firstName: 'Peyton', lastName: 'Gardner' },
]

const groups = 3

function result(students, groups) {
	let result = []
  
  const sortedStudents = students.sort((a,b) => {
    return a.firstName.localeCompare(b.firstName)
  })
  
  const array = sortedStudents.slice()
  const size = Math.ceil(sortedStudents.length / groups--)
   
  while (array.length) {
    result.push(array.splice(0, size))
  }

  return result
}

console.log(result(students, groups))

