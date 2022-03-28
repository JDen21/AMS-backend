const port = 3000 || process.env.PORT
const tempID = '62407f0b58aa79d8dbe701db'  //id for default benefactor
 

const express = require('express')
const cors = require('cors')
const [User, Benefactor] = require('./database')
const userRoutes = require('./users')
const benefRoutes = require('./benefactor')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "*", 
        credentials: true
    }
})

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json()) 
app.use('/user', userRoutes)
app.use('/benefactor', benefRoutes)

// const httpServer = createServer(app)
// const io = new Server(httpServer, {})



io.on('connection',(socket) =>{
    // console.log(socket.id)
    socket.on('socketInit',(data) =>{
        socket.join(data)
        // console.log(socket.rooms) 
        // console.log(data) 
    })
})

app.post('/', (req,res) =>{
    res.send('working')
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
            gender: 'unfilled',
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
            benefactorID: tempID,  //add default id
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
        
        // console.log('here') 
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
        const options = {
            returnDocument: 'after',
            returnNewDocument: true
        }
        User.findOneAndUpdate({_id: req.params.id}, req.body, options, (err, found) =>{
            if(err)
                throw err
        })
    }
}) 


app.post('/gsm-update/:id', (req,res) => {
    const data = {
        vibration: req.query.vib,
        pulse: req.query.pulse,
        lat: req.query.lat,
        lon: req.query.lon,
        update: new Date().toString().substring(3,16)
    }
    
  
        io.sockets.in(req.params.id).emit('recentChange', data)
  

    const options = {
        returnDocument: 'after',
        returnNewDocument: true
    }
    
    User.findOneAndUpdate({_id: req.params.id}, data, options, (err, found)=>{
        // console.log(found)
        res.send(found)
    })
})

// path for notifs in benefactor page
// query color=red, yellow, blue
// ?color=red
app.post('/notifications/:id', (req, res) =>{
    const color = req.query.color

    if(color === 'red'){
        // respond to accident
        const data = {
            lat: req.query.lat,
            lon: req.query.lon,
            vib: req.query.vib,
            pulse: req.query.pulse,
            name: req.query.name,
            color: color
        }
        // if name found in benefactor user list, notify else ignore
        // 'http://localhost:3000/notifications/1234567?lat=24&lon=23&vib=65&pulse=40&name=myName&color=red'
        // io.sockets.in(req.params.id).emit('redNotif', data)

        Benefactor.findOne({_id: req.params.id}, (err, found) =>{
            if(err)
                throw err
            if(!found)
                console.log('no found benefactor with the given id') //benefactor status 404
            if(found){
                found.userIDs.forEach(uid => {
                    if(uid.name === data.name)
                        io.sockets.in(req.params.id).emit('redNotif', uid, data)
                });
            }
            
        })
    }
    if(color === 'yellow'){
        // remove user from user list

    }
    if(color === 'blue'){
        // incoming user request
        //http://localhost:3000/notifications/1234567?color=blue&uid=1234567890
        User.findOne({_id: req.query.uid}, (err, found) => {
            if(err)
                throw err
            if(found){
                const data = {
                    name: found.name,
                    address: found.address,
                    update: found.update,
                    mobile: found.mobile,
                    device: found.device,
                    gender: found.gender,
                    email: found.email,
                    color: 'blue'
                }
                io.sockets.in(req.params.id).emit('blueNotif', data)
            }

        })
    }
})

http.listen(port,()=>{ 
    console.log('listening to port ' + port)
})   
