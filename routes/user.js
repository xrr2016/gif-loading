import express from 'express'
const user = express.Router()

// register route
user.get('/register', (req, res) => {
  res.render('register')
})

// login route
user.get('/login', (req, res) => {
  res.render('login')
})

export default user