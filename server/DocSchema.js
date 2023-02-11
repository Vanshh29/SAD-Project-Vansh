const {Schema, model} = require('mongoose')

// 155. so tis schema is detecting what is in the object
const DocSchema = new Schema({
    _id: String,
    data: Object,
})

// 156. exporting as a model
module.exports = model("DocSchema", DocSchema)