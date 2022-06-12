const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User, Product} = require('./schema.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {
    generateAccessToken,
    generateRefreshToken,
    authAccessToken,
    checkInput
} = require('./auth.js');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/jwt')
    .then(() => console.log('connected'))
    .catch((err) => console.log(err))

app.get('/', (req, res)=>{
    res.send('Please Login or Register')
})

app.get('/product', authAccessToken, async (req, res)=>{
    try{
        const product = await Product.find()
        res.send(product)
    } catch (err){
        console.log(err.message);
        res.status(500).send('Error!')
    }
})

app.post('/product/', authAccessToken, async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.redirect('/product')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Something wrong!')
    }
})

app.patch('/product/', authAccessToken, async (req, res) => {
    try {
        await Product.updateOne({ productName: req.body.productName }, req.body)
        res.redirect('/product')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Something wrong!')
    }
})

app.put('/product/', authAccessToken, async (req, res) => {
    try {
        await Product.replaceOne({ productName: req.body.productName }, req.body)
        res.redirect('/product')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Something wrong!')
    }
})

app.delete('/product/:productName', authAccessToken, async (req, res) => {
    try {
        const deleteProduct = await Product.deleteOne({ productName: req.params.productName.replace(/-/g, ' ') })
        console.log(deleteProduct)
        res.redirect('/product')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Something wrong!')
    }
})

app.listen(4000, () => {
    console.log('http://localhost:4000')
})