const port =  process.env.PORT || 3000
const tempID = '6241ebb70f1c34a4f74467a3'  //id for default benefactor
const SALT = 10 

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
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

app.get('/', (req,res) =>{
    res.send('my home page')
})

// login
app.post('/login/:type',(req,res) => {
   
    // const data = { 
    //     $and:[
    //        { name: req.body.name},
    //        {password: req.body.password}
    //     ]
    // }
    
    
    if(req.params.type === 'benefactor'){
    Benefactor.findOne({ name: req.body.name}, (err, found) =>{
            if(err)
                console.log('/login: ' + err)
            if(!found)
                res.send('account not found') 
            if(found){
                bcrypt.compare(req.body.password, found.password).then(result=>{
                    if(result)
                        res.send(found._id)
                    else
                    res.sendStatus(0)
                })
            }
               
        })
    }

    if(req.params.type === 'user') {
        User.findOne({ name: req.body.name}, (err, found) =>{
            if(err)
                console.log('/login: ' + err)
            if(!found) 
                res.send('account not found')
            if(found){
                bcrypt.compare(req.body.password, found.password).then(result=>{
                if(result)  
                    res.send(found._id)
                else
                    res.sendStatus(0)
                })
            }
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

        bcrypt.hash(req.body.password, SALT).then((hash)=>{
            data.password = hash
            const benefactor = new Benefactor(data)
            // console.log(benefactor._id)
            benefactor.save((err,saved) =>{
                if(err)
                    res.send({response: err})
                res.status(200).send({id: benefactor._id})
                
            })
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
        bcrypt.hash(req.body.password, SALT).then((hash)=>{
            data.password = hash
            const user = new User(data)
            user.save((err,saved) =>{
                if(err)
                    res.send({response:err})
                else
                    res.status(200).send({id: user._id}) 
            })  
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
        // res.send(found)
        if(found)
            res.sendStatus(200)
    })
})

app.post('/red-notif/:bid/:uid', (req, res) => {
    
    // res.send('works')
    const data = {
        latitude: req.query.latitude,
        longhitude: req.query.longhitude,
        vibration: req.query.vibration,
        pulse: req.query.pulse,
        name: '',
        email: '',
        phone: ''
    }

    User.findOne({_id: req.params.uid}, (err, found)=>{
        if(err)
            res.sendStatus(500)
        if(!found)
            res.sendStatus(404)
        data.name = found.name
        data.email = found.email
        data.phone = found.mobile
    })

    Benefactor.findOne({_id: req.params.bid}, (err, found)=>{
        if(err)
            throw err;
        if(!found)
            console.log('not found');
        // console.log(found)
        found.userIDs.forEach(user =>{
            if(user._id.valueOf() === req.params.uid){
                // console.log('reached here')
                // console.log(req.params.bid)
                io.sockets.in(req.params.bid).emit('redNotif', data)
            }
        })
        res.sendStatus(200)
    })
})

app.post('/blue-notif/:uid', (req, res) =>{
    const bname = req.body.request

    Benefactor.findOne({name: bname}, (err, found)=>{
        if(err)
            throw err
        if(!found)
            console.log('no benefactor with the name found')

        User.findOne({_id: req.params.uid}, (err1, found1)=>{
            if(err1)
                throw err1 
            if(!found1)
                console.log('no user found1 ')
            const data = {
                name: found1.name,
                address: found1.address,
                email: found1.email,
                phone: found1.mobile,
                gender: found1.gender
            }
            // console.log(data)
            io.sockets.in(found._id.valueOf()).emit('blueNotif', data)
        })   
    }) 
    
    res.send('blue notif')
})

http.listen(port,()=>{ 
    console.log('listening to port ' + port)
})   
