import db from '../../lib/db'
import moment from 'moment'
const Appointment = db.model('appointment')
const User = db.model('user')

export async function list(_, { user: { role, _id } }) {
  if (role === 'ADMIN') {
    return Appointment.find()
  }
  return Appointment.find().or([{ issuer: _id }, {receiver: _id}])
}

function appointmentValidationErrors(errors) {
  return {
    result: {
      message: 'Appointment validation errors',
      success: false
    },
    errors
  }
}

export async function create ({ receiver, startTime: unformattedStartTime, endTime: unformattedEndTime, description }, { user: { _id: issuer }}) {
  // check if receiver exists
  const receiverUser = await User.findById(receiver)

  if (!receiverUser) {
    return appointmentValidationErrors({
      receiver: 'Appointment receiver not found'
    })
  }

  const startTime = moment(unformattedStartTime, 'YYYY-MM-DD @ HH:mm')
  const endTime = moment(unformattedEndTime, 'YYYY-MM-DD @ HH:mm')

  console.info({ startTime, endTime })

  if (!startTime.isValid()) {
    return appointmentValidationErrors({
      startTime: 'Invalid date'
    })
  }

  if (!endTime.isValid()) {
    return appointmentValidationErrors({
      endTime: 'Invalid date'
    })
  }
  // Check if times aren't in a past and create a range
  if (startTime.isBefore(moment())) {
    return appointmentValidationErrors({
      startTime: 'Can not create an appointment in a past'
    })
  }

  if (endTime.isBefore(startTime)) {
    return appointmentValidationErrors({
      startTime: 'Appointment dates not creating range'
    })
  }

  // TODO: This is a good place to check for other conflicting appointments in that time

  const appointment = new Appointment({
    issuer,
    receiver,
    startTime: startTime.toDate(),
    endTime: endTime.toDate(),
    description,
    status: 'CREATED'
  })
  return {
    appointment: appointment.save(),
    result: {
      success: true
    }
  }
}

export async function appointmentApprove ({ id }, { user: { _id: receiver }}) {
  const appointment = await Appointment.findById(id)

  // check if appointment exists and user has permissions to it
  if (!appointment || appointment.receiver.toString() !== receiver.toString()) {
    return {
      result: {
        success: false,
        message: 'Appointment not found'
      }
    }
  }

  if (appointment.status !== 'CREATED') {
    return {
      result: {
        success: false,
        message: 'Appointment is already approved or rejected'
      }
    }
  }

  appointment.status = 'APPROVED'
  return {
    result: {
      success: true
    },
    appointment: appointment.save()
  }
}

export async function appointmentReject () {
  return {
    result: {
      success: false,
      message: 'NOT IMPLEMENTED'
    }
  }
}
