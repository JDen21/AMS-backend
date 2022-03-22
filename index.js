const express = require('express')
const cors = require('cors')
const [User, Benefactor] = require('./database')
const userRoutes = require('./users')
const benefRoutes = require('./benefactor')

const app = express();

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/user', userRoutes)
app.use('/benefactor', benefRoutes)

let port = 3000 || process.env.PORT

app.post('/', (req,res)=>{
    console.log('backend')
    res.send('backend')
})
  
// login
app.post('/login/:type',(req,res) => {
    const data = { 
        $and:[
           { name: req.body.name},
           {password: req.body.password}
        ]
    }
    // console.log(data)
    if(req.params.type === 'benefactor'){
        Benefactor.findOne(data, (err, found) =>{
            if(err)
                console.log('/login: ' + err)
            if(!found)
                res.send('account not found')
            if(found)
                res.send(found._id)
            // console.log(found)
        })
    }

    if(req.params.type === 'user'){
        User.findOne(data, (err, found) =>{
            if(err)
                console.log('/login: ' + err)
            if(!found)
                res.send('account not found')
            if(found)
                res.send(found._id)
            // console.log(found)
        })
    }
})

// signup

app.post('/signup/:type', (req,res) =>{

    if(req.params.type === 'benefactor'){
        // define data content
        // console.log(req.body.password)
        const data = {
            name: req.body.name,
            mobile: req.body.number,
            org: req.body.org,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            userIDs: [],
            requestIDs: []
        }
        const benefactor = new Benefactor(data)
        // console.log(benefactor._id)
        benefactor.save((err,saved) =>{
            if(err)
                res.send({response: err})
            res.status(200).send({id: benefactor._id})
            
        })
    }
    if(req.params.type === 'user'){

        // define data content
        // console.log(req.body.name)
        const data = {
            name: req.body.name,
            mobile: req.body.mobile,
            device: req.body.device,
            password: req.body.password,
            benefactorID: '62393ea8e92966e71c2b441b',  //add default id
            vibration: 0,
            pulse: 0,
            lat: 0,
            lon: 0,  
            update: new Date().toString().substring(3,16),
            gender: 'unfilled',
            address: 'unfilled',
            email: 'unfilled',
            request: ''
        }
        const user = new User(data)
        user.save((err,saved) =>{
            if(err)
                res.send({response:err})
            else
                res.status(200).send({id: user._id}) 
        })
    }
})



// updates
app.post('/update/:type/:id', (req, res) =>{
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
    const data = {
        vibration: req.query.vib,
        pulse: req.query.pulse,
        lat: req.query.lat,
        lon: req.query.lon,
        update: new Date().toString().substring(3,16)
    }

    User.findOneAndUpdate({_id: req.params.id}, data, {returnDocument: 'after'}, (err, found)=>{
        // console.log(found)
        res.send(found)
    })
})



app.listen(port,()=>{
    console.log('listening to port ' + port)
})   