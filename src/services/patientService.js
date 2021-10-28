import db from '../models/index';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import emailService from '../services/emailService';

let buildUrlEmail = (doctorId, token) => {
  let result =
    (result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`);
  return result;
};

let patientBookAppointmentById = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: 'R3',
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }

        resolve({
          data: user,
          errorCode: 0,
          errorMessage: 'Save info patient success',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let verifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1',
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = 'S2';
          await appointment.save();
          resolve({
            errorCode: 0,
            errorMessage: 'Update the appointment success',
          });
        } else {
          resolve({
            errorCode: 2,
            errorMessage: 'Appointment has been activated or does not exit',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  patientBookAppointmentById,
  verifyBookAppointment,
};
