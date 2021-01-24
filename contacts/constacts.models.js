const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    subscription: {type: String},
    password: {type: String, required: true},
    token: {type: String}
});

const ContactModel = mongoose.model('contacts', contactSchema);

module.exports = ContactModel;