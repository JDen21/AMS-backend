const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

let port = 3000 || process.env.PORT

app.post('/', (req,res)=>{
    console.log('backend')
    res.send('backend')
})
 
// login
app.post('/login',(req,res) => {
    let data = {
        name: req.body.name,
        pass: req.body.pass,
        type: req.body.type
    }
})

// signup

app.post('/signup/:type', (req,res) =>{

    if(req.params.type === 'benefactor'){
        // define data content
    }
    if(req.params.type === 'user'){
        // define data content
    }
})

// user page customizes
app.post('/user/init/:id', (req,res) =>{
    // custom test
    // console.log(req.params.id)   
    let data = {
        vibration : 5,
        pulse : 6,
        responder : 5,
        location : 5,
        distance : 5,
        latitude :  5,
        longhitude : 5,
        name: "D Garcia"
    }
    res.send(data)
})

app.post('/user/change-benefactor/:id', (req, res) => {
    res.send('apple')
})

// benefactor page customizes
app.post('/benefactor/:id', (req,res) =>{

})

// updates
app.post('/update/:type', (req, res) =>{
    if(req.params.type === 'benefactor'){
        // define data content
    }
    if(req.params.type === 'user'){
        // define data content
    }
})

// gsm module request from arduino  
// query params
// id (device id)
// long
// lat
// vibration
// pulse
app.post('/gsm-update/:id', (req,res) => {

})



app.listen(port,()=>{
    console.log('listening to port ' + port)
})   