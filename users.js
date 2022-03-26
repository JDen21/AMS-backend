const express = require('express')
const router = express.Router()
const [User, Benefactor] = require('./database')

// user page customizes
router.post('/init/:id', (req,res) =>{
    // custom test
    // console.log(req.params.id)   
    User.findOne({_id: req.params.id}, (err, found)=>{
        if(err)
            res.status(404).send({response:'unknown error'})
        if(!found)
            res.status(404).send({response:'user not found'})
        if(found){
            // console.log(found.name)  
            Benefactor.findOne({_id: found.benefactorID}, (berr, bfound)=>{
                if(berr)
                    res.status(404).send({response:'unknown error'})
                // console.log(bfound)
                if(!bfound){
                    res.status(404).send({response:'benefactor not found'})
                }
                const data = {
                    vibration : found.vibration,
                    pulse : found.pulse,
                    responder : bfound.name ,
                    // responder: '',
                    location : bfound.address,
                    // location: '',
                    distance : 0, 
                    latitude : found.lat ,
                    longhitude : found.lon,
                    name : found.name,
                    gender: found.gender,
                    address: found.address,
                    email: found.email,
                    phone: found.mobile,
                    device: found.device,
                    org: bfound.org
                    // org: ''
                }

                res.send(data)
            })
            
            // console.log(found)
        }
    })
    // res.send({response: 'unkown error'})
    // console.log(req.params.id)
})

router.post('/change-benefactor/:id', (req, res) => {

    const options = {
        returnDocument: 'after',
        returnNewDocument: true
    }
    
    const queryBenefactor =  {name: req.body.request}
        
    // console.log(queryBenefactor)
    // saves user to chosen benefactors requestIDs
    // saves chosen benefactors id to users pending request
    // benefactor still has to accept tho
    User.findOne({_id: req.params.id}, (err, found) =>{
        if(err)
            throw err
        if(found){
            Benefactor.findOneAndUpdate(queryBenefactor, {
                $push: {
                    requestIDs: found
                }
            }, options, (err2, found2) =>{
                if(err2) 
                    throw err2
                if(found2){  
                    User.findOneAndUpdate({_id:req.params.id},{request: found2._id}, options)
                }
            }) 

       
        }
    } )
})
 
router.post('/code/:id', (req,res) =>{
    // customize test.txt
    // send to frontend
   res.download('./test.txt') 
})

module.exports = router