const http = require('http')
const express = require('express')
const { response } = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('content', function (req, res) {return JSON.stringify(req.body)})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

let contacts = [
    {   
        "id" : 1,
        "name" : "Arto Hellas",
        "number" : "0177-1929181"
    },
    {
        "id" : 2,
        "name" : "Ada Lovelace",
        "number" : "0177-12433424"
    },
    {
        "id" : 3,
        "name" : "Dan Abramov",
        "number" : "0177-19234249"
    },
    {
        "id" : 4,
        "name" : "Dan Abrams",
        "number" : "0177-19234223"
    }
]

app.get("/api/persons", (req,res) => {
    res.send(contacts)
})

app.get("/info", (req,res) => {
    const t = contacts.length
    const d = Date()
    const s = `Phonebook has info for ${t} people`
    const fin = s + "<br>" + d
    res.send(fin)
})

app.get("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)

    if (!contacts.find(contact => contact.id === id)) {
        res.status(404).end()
    }

    t = contacts.filter(contact => contact.id === id)

    res.send(t)
})

app.delete("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    res.status(204).end()
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.post("/api/persons", (req,res) => {
    const contact = req.body

    for(var i=0; i<contacts.length; i++) {var maxID = i+2}
    contact.id = maxID
    
    if (!contact.name) {
        return res.status(400).json({
            error: 'contact missing'
        })
    }

    if (contacts.find(con => con.name.toUpperCase() === contact.name.toUpperCase())) {
        return res.status(400).json({
            error: 'contact already exists'
        })
    }

    contacts = contacts.concat(contact)
    res.send(contacts)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})