import express from 'express'
import User, { createUser } from '../models/user'

const router = express.Router()
// register route
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { nickname, username, password, email } = req.body

  req.checkBody('nickname', 'Nickname is required!').notEmpty()
  req.checkBody('username', 'Username is required!').notEmpty()
  req.checkBody('password', 'Password is required!').notEmpty()
  req.checkBody('email', 'Email is required!').notEmpty()
  req.checkBody('email', 'Need a valid email!').isEmail()

  const errors = req.validationErrors()
  if (errors) {
    res.render('register', { errors })
  } else {
    const newUser = new User({ nickname, username, password, email })
    createUser(newUser, () => {
      newUser.save()
    })
    req.flash('user', newUser)
    req.flash('success_msg', 'Well Done!')
    res.redirect(302, '/users/login')
  }
})

// login route
router.get('/login', (req, res) => {
  res.render('login')
})

export default router
