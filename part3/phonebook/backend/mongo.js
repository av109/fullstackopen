const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const username = process.argv[3]
const usernumber = process.argv[4]

// const url = `mongodb+srv://fullstack:${password}@cluster0.med0ywf.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
const url = `mongodb+srv://fullstack:${password}@cluster0.ojzlssj.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)
if (!username && !usernumber) {
  // Show all entries in the phonebook
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  // Add a new person to the phonebook
  const person = new Person({
    name: username,
    number: usernumber,
  })

  person.save().then((result) => {
    console.log('person saved')
    console.log(result)
    mongoose.connection.close()
  })
}






// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// const person = new Person({
//   name: username,
//   number: usernumber,
// });

// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
