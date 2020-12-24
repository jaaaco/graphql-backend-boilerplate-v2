import mongoose from 'mongoose'
import { hash } from '../resolvers/user'

//
if (!mongoose.modelNames().length) {
  const userDbSchema = new mongoose.Schema({
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: String,
    role: String,
    created: { type: Date, default: Date.now, index: true }
  })

  mongoose.model('user', userDbSchema)

  const appointmentSchema = new mongoose.Schema({
    status: String,
    issuer: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    startTime: Date,
    endTime: Date,
    description: String,
    created: { type: Date, default: Date.now, index: true }
  })

  mongoose.model('appointment', appointmentSchema)

  // create default admin user
  const User = mongoose.model('user')

  User.count().then(userCount => {
    if (userCount === 0) {
      const adminUser = new User({
        email: 'admin@example.com',
        passwordHash: hash('123456'),
        role: 'ADMIN'
      })
      adminUser.save().then(result => console.info('Admin user created: ', result)).catch(console.error)

      const user = new User({
        email: 'user@example.com',
        passwordHash: hash('123456'),
        role: 'STANDARD'
      })
      user.save().then(result => console.info('Standard user created: ', result)).catch(console.error)
    }
  })
}

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', { useNewUrlParser: true })

export default mongoose

