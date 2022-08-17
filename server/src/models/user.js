const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    token: {
        type : String,
        require: true,
    },
    n_know: {
        type : String,
        default: 0
    },
    n_completed: {
        type : String,
        default: 0
    },
    n_seen: {
        type : String,
        default: 0
    },
    date : {
        type : Date,
        default: new Date()
    },


})
module.exports =  mongoose.model( 'User' , UserSchema);