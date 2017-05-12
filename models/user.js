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

export default mongoose.model('User', userSchema)

export const createUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      callback(user)
    })
  })
}
