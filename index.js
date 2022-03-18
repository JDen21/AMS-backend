const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

app.post('/', (req,res)=>{
    console.log('backend')
})
 
// login
app.post('/user-login', (req,res) =>{
    // console.log(req.body)
    // res.send('success') 
    // identify user from db
    // if(req.body.name exist in database && has the same pass and type fill data)
    // else res.send(no such user)
    let data = {
        name: req.body.name,  //from database
        pass: req.body.pass  
        // id: 
    }
    res.json(data)
})

app.post('/benefactor-login', (req,res)=>{
    // console.log(req.body)
    // res.send('success') 
    // identify user from db
    // if(req.body.name exist in database && has the same pass and type fill data)
    // else res.send(no such user)
    let data = {
        name: req.body.name,  //from database
        pass: req.body.pass  
        // id: 
    }
    res.json(data)
})

// signup

app.post('/benefactor-signup', (req,res)=>{
    // database.save(req.data)
    // if data in database
    // res.send(success)
    // else
    // res.send(fail)
})

app.listen(3000,()=>{
    console.log('listening to port ' + 3000)
})   