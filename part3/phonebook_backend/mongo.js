const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('provide password')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@fso-cluster.wrgtek0.mongodb.net/PhonebookDb?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(rec => {
            console.log(`${rec.name} ${rec.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const name = process.argv [3]
    const number = process.argv[4]
    const p = new Person({
        name: name,
        number: number
    })
    p.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })    
}

