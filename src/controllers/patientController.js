import patientService from '../services/patientService';

let patientBookAppointment = async (req, res) => {
  try {
    let info = await patientService.patientBookAppointmentById(req.body);
    console.log(`req.body`, req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

let verifyBookAppointment = async (req, res) => {
  try {
    let info = await patientService.verifyBookAppointment(req.body);
    console.log(`req.body`, req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

module.exports = {
  patientBookAppointment,
  verifyBookAppointment,
};
