const fs = require('fs-extra')
const [User, Benefactor] = require('./database')

function editFile(uid){
    const baseFile = './codeBase.txt'
    fs.readFile(baseFile, 'utf8', (err, data)=>{
    // const result = data.replace('1234567ssa', uid)
    // console.log(result) 
    User.findOne({_id:uid}, (err, found)=>{
        if(err)
            throw err
        Benefactor.findOne({_id:found.benefactorID}, (err1, found1)=>{
            if(err1)
                throw err1
            const result = data.replace('1234567ssa', uid).replace('+63911', found1.mobile).replace('0987654321',found.benefactorID)
             fs.writeFile('./UserFiles/'+found._id+'.ino', result, 'utf8') 
        })
    }) 
   })
     
} 

// editFile('6239dfc48ace7bdd2030a6f7') 

module.exports = editFile  
 