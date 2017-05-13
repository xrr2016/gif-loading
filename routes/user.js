import express from 'express'
import User, {
  createUser,
  getUserByUsername,
  getUserById,
  comparePassword
} from '../models/user'
import passport from 'passport'
// import { LocalStrategy } from 'passport-local'
const LocalStrategy = require('passport-local').Strategy
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

passport.use(
  new LocalStrategy(function (username, password, done) {
    getUserByUsername(username, function (err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, { message: 'Unknown User' })
      }

      comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  function (req, res) {
    res.redirect('/')
  }
)


router.get('/logout', (req, res, next) => {
  req.logout()
  req.flash('success_msg', 'Logout success!')
  res.redirect('/')
})
export default router
