const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   email: {type: String, required: true},
   hashPassword: {type: String, required: true}
},{
    timestamps: true,
    collection: 'Users',
});

module.exports = mongoose.model('userModel',userSchema);