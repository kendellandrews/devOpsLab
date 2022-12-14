const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const students = ['Kendell', 'Amelia', 'Kelly']

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '6bb8371fdd2e419888aac57d931cd86f',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           rollbar.log('Students added successfully')
           res.status(200).send(students)
       } else if (name === ''){
            rollbar.warning('Students not added')
           res.status(400).send('You must enter a name.')
       } else {
            rollbar.critical('Student already in arr')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info('student was deleted')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050


app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Server listening on ${port}`))
