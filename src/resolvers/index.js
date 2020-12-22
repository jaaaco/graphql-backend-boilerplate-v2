import * as user from './user'
import * as appointment from './appointment'

const resolvers = {
  Mutation: {
    signIn: user.signIn,
    signUp: user.signUp
  },
  Query: {
    me: user.me,
    appointments: user.authorized(appointment.list)
  }
}

export default resolvers
