const { default: mongoose } = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    name: String,
    subscribedToChannel:String,
    subscribedDate:String
})


module.exports = mongoose.model('subscriber',subscriberSchema)