const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to ', result)
    }).catch((error) => {
        console.log('FAILED connecting to ', error)
    })

const personSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)