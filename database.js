const mongoose = require('mongoose')
const { Schema } = mongoose

// mongoose.connect('mongodb+srv://admin-den:AdminDinosaur21@amsdatabase.bgx5x.mongodb.net/AMSDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://localhost:27017/AMSDB', {useNewUrlParser: true, useUnifiedTopology: true});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: String,
    device: String,
    password: {
        type: String,
        required: true
    },
    benefactorID: String,
    vibration: Number,
    pulse: Number,
    lat: Number,
    lon: Number,
    update: Date,
    address: String,
    gender: String, 
    email: String,
    request: String //new benefactors id if request accepted ''
}) 

const BenefactorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: String, 
    email: String,
    gender: String,
    org: String,
    address: String,
    password: {
        type: String,
        required: true
    },
    userIDs: [UserSchema],
    requestIDs: [UserSchema] //ids of requesting users
})

const User = mongoose.model('User', UserSchema)
const Benefactor = mongoose.model('Benefactor', BenefactorSchema)

module.exports = [User, Benefactor]