const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    refreshToken: String
})

const User = mongoose.model('User', userSchema)

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    category: String
})

const Product = mongoose.model('Product', productSchema)

module.exports = {
    User,
    Product
}