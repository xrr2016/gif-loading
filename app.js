import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import hbs from 'express-handlebars'
import validator from 'express-validator'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import { LocaLStrategy } from 'passport-local'
import mongo from 'mongodb'
import mongoose from 'mongoose'

import indexRoutes from './routes/index'
import usersRoutes from './routes/user'

mongoose.connect('mongodb://localhost/node-login', err => {
  if (err) {
    console.log(err)
  }
})

const db = mongoose.connection

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', hbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'this is a secret',
  saveUninitialized: true,
  rasave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(validator({
  errorForamtter(param, msg, value) {
    const namespace = param.split('.')
    const root = namespace.shift()
    let formParam = root

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`
    }

    return {
      param: formParam,
      msg,
      value
    }
  }
}))

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', indexRoutes)
app.use('/users', usersRoutes)

app.set('port', (process.env.PORT || 8000))

app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`)
})

export default app