import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
  nickname: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    index: true,
    unique: true
  },
  creat_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)

export default User

export const createUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      callback(user)
    })
  })
}

export const getUserByUsername = function (username, callback) {
  var query = { username: username }
  User.findOne(query, callback)
}

export const getUserById = function (id, callback) {
  User.findById(id, callback)
}

export const comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
