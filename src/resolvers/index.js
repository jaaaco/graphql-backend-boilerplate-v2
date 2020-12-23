import * as user from './user'
import * as appointment from './appointment'

const resolvers = {
  Mutation: {
    signIn: (_, data) => user.signIn(data),
    signUp: (_, data) => user.signUp(data),
    appointmentCreate: (_, data, context) => user.authorized(context, appointment.create, data),
    appointmentReject: (_, data, context) => user.authorized(context, appointment.appointmentReject, data),
    appointmentApprove: (_, data, context) => user.authorized(context, appointment.appointmentApprove, data),
  },
  Query: {
    me: (_, data, context) => user.authorized(context, user.me, data),
    appointments: (_, data, context) => user.authorized(context, appointment.list, data),
    users: (_, data, context) => user.authorizedAdmin(context, user.list, data),
  }
}

export default resolvers
