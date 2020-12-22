import mongoose from 'mongoose'
import moment from 'moment-timezone'

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
    name: String,
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
    description: String,
    created: { type: Date, default: Date.now, index: true }
  })

  mongoose.model('appointment', appointmentSchema)
}

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

export default mongoose

export function getConditions ({ range, search, columns, timezone }) {
  if (search) {
    return { $and: [getConditionsFromRange(range, timezone), getConditionsFromSearch(search, ...columns)] }
  } else {
    return getConditionsFromRange(range, timezone)
  }
}

export function getSort (order) {
  const [ field, direction ] = order.split('_')
  return { [field]: direction === 'asc' ? 1 : -1 }
}

export function getConditionsFromRange ({ name, from, to }, timezone, dateColumn = 'created') {
  if (!from && !to && !name) {
    return {}
  }

  if (!name) {
    const conditions = []
    if (from) {
      conditions.push({ [dateColumn]: { $gte: moment.tz(from, timezone).toISOString() } })
    }
    if (to) {
      conditions.push({ [dateColumn]: { $lte: moment.tz(to, timezone).toISOString() } })
    }
    if (conditions.length === 1) {
      return conditions[0]
    }
    return { $and: conditions }
  }

  switch (name) {
    case 'allTime':
      return {}
    case 'thisMonth':
      return { [dateColumn]: { $gte: moment().tz(timezone).startOf('month').toISOString() } }
    case 'prevMonth':
      return { $and: [
        { [dateColumn]: { $gte: moment().tz(timezone).startOf('month').add(-1, 'month').toISOString() } },
        { [dateColumn]: { $lt: moment().tz(timezone).startOf('month').toISOString() } }
      ] }
  }
}

export function getConditionsFromSearch (search, ...columns) {
  if (!search) {
    return {}
  }
  const conditions = []
  columns.forEach(column => {
    const tokens = []
    search.split(' ').forEach(token => tokens.push({ [column]: { $regex: token, $options: 'i' } }))
    if (tokens.length > 1) {
      conditions.push({ $and: tokens })
    } else {
      conditions.push(tokens[0])
    }
  })
  return { $or: conditions }
}
