const express = require('express')
const io = require('.')
const router = express.Router()
const [User, Benefactor] = require('./database')



// benefactor page customizes
router.post('/init/:id', (req,res) =>{
    Benefactor.findOne({_id: req.params.id}, (err, found)=>{
       if(err)
        console.log(err)
        
        if(!found)
            console.log('no benefactor account found')

        if(found){ 
            let arr = []
            found.requestIDs.forEach(user => {
                arr.push({
                    name: user.name,
                    device: user.device,
                    mobile: user.mobile,
                    email: user.email,
                    _id: user._id
                })
            });
            const data = {
                name: found.name,
                gender: found.gender,
                address: found.address,
                email: found.email,
                mobile: found.mobile,
                users: found.userIDs,
                requesters: arr
            }
            res.send(data)
        }
       
    })
})



// move requester to user
router.post('/add-user/:id', (req, res) => {
    // console.log(req.body._id)
    const id = req.query.uid
    console.log(id)
    const query = { _id: id }
    const options = {
        returnDocument: 'after',
        returnNewDocument: true
    }

    User.findOne(query, (err, found) =>{
        if(err)
            throw err
        if(found){
            Benefactor.findOneAndUpdate({_id: req.params.id}, {
                $pull: {
                    requestIDs: found
                }
            }, options,(err2, found2) => {
                if(err2)
                    throw err2
                if(found2)
                    console.log(found2)
                    // res.send(found.requestIDs)
            })

            Benefactor.findOneAndUpdate({_id: req.params.id}, {
                $push: {
                    userIDs: found
                }
            }, options,(err2, found2) => {
                if(err2)
                    throw err2
                if(found2)
                    // console.log(found2)
                    res.send(found2)
            })
        }
    })
})


module.exports = router
