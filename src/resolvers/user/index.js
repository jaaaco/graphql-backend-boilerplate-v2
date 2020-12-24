import Validator from '../../lib/validator'
import _ from 'lodash'
import db, { getSort, getConditions } from '../../lib/db'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'

const TOKEN_KEYS = ['_id', 'email', 'role']

export const JWT_SECRET = process.env.JWT_SECRET || 'Chuquoohay2thal3Uigheimeiraichox'

export function hash (password) {
  return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex')
}

export async function generateToken (_id) {
  const user = await db.model('user').findById(_id)
  return jwt.sign({
    // 8 hours token expiration
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8),
    user: pick(user, TOKEN_KEYS)
  }, JWT_SECRET)
}

function encrypt (text) {
  const cipher = crypto.createCipher('aes256', JWT_SECRET) // eslint-disable-line node/no-deprecated-api
  let crypted = cipher.update(text.toString(), 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt (text) {
  try {
    const decipher = crypto.createDecipher('aes256', JWT_SECRET) // eslint-disable-line node/no-deprecated-api
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (e) {
    return ''
  }
}

const userSchema = {
  email: [{
    test: 'isEmail',
    message: 'Provide valid email'
  }, {
    test: async (email) => {
      const existingUser = await db.model('user').findOne({ email })
      return !existingUser
    },
    message: 'This email is already used by another user'
  }],
  password: {
    test: password => password.length >= 6,
    message: 'Password must be at leasy 6 characters long'
  },
  passwordConfirmation: {
    test: (passwordConfirmation, data) => {
      return passwordConfirmation === undefined || (!!passwordConfirmation && (passwordConfirmation === data.password))
    },
    message: 'Passwords don\'t match'
  }
}

export async function signUp ({ email, password, passwordConfirmation }) {
  email = email.toLowerCase()

  const validator = new Validator(userSchema)
  const errors = await validator.validate({ email, passwordConfirmation, password })

  if (!_.isEmpty(errors)) {
    console.info({ errors })
    return {
      errors,
      result: {
        success: false
      }
    }
  }

  const User = db.model('user')
  const user = new User({
    email,
    passwordHash: hash(password),
    role: 'STANDARD'
  })
  const savedUser = await user.save()

  // good place to send welcome email
  // await sendEmail({
  //   template: 'welcome',
  //   subject: 'Welcome to our servive',
  //   variables: {
  //     email
  //   },
  //   to: email
  // })

  return {
    result: {
      success: true
    },
    token: generateToken(savedUser._id),
    user: savedUser
  }
}

const invalidUserResponse = {
  result: {
    success: false,
    message: 'Invalid email or password'
  }
}

export async function signIn ({ email, password }) {
  const user = await db.model('user').findOne({ email })

  if (!user) {
    return invalidUserResponse
  }

  if (!user.passwordHash) {
    return invalidUserResponse
  }

  if (user.passwordHash !== hash(password)) {
    return invalidUserResponse
  }

  return {
    result: {
      success: true
    },
    token: generateToken(user._id),
    user
  }
}


export function authorized (context, fn, data) {
  const user = getUser(context)
  if (!user) {
    throw new Error('not-authorized')
  }
  return fn(data, { user, context })
}

export function authorizedAdmin (context, fn, data) {
  const user = getUser(context)

  if (!user || user.role !== 'ADMIN') {
    throw new Error('not-authorized')
  }
  return fn(data, { user, timezone: context.timezone })
}

export function get(userId) {
  return db.model('user').findById(userId)
}

export function getUser (context) {
  let token = context.authorization

  if (!token) {
    return null
  }

  if (token.match(/^Bearer /)) {
    token = token.split(' ')[1]
  }
  try {
    const decrypted = jwt.verify(token, JWT_SECRET)
    if (!decrypted.user) {
      return null
    }

    if (_.difference(_.keys(decrypted.user), TOKEN_KEYS).length) {
      return null
    }

    return decrypted.user
  } catch (e) {
    return null
  }
}

export async function list (_, { user: { role }}) {
  return db.model('user').find(role !== 'ADMIN' ? { role: 'STANDARD'} : {})
}

export async function me (_, { user: { _id } }) {
  return db.model('user').findById(_id)
}
