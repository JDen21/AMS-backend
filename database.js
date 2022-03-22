const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/AMSDB', {useNewUrlParser: true, useUnifiedTopology: true});

const UserSchema = new Schema({
    name: String,
    mobile: String,
    device: String,
    password: String,
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
    name: String,
    mobile: String,
    email: String,
    org: String,
    address: String,
    password: String,
    userIDs: [String],
    requestIDs: [String] //ids of requesting users
})

const User = mongoose.model('User', UserSchema)
const Benefactor = mongoose.model('Benefactor', BenefactorSchema)

module.exports = [User, Benefactor]