import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      message: 'Error from server...',
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

let postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let id = req.body.id || req.query.id;
    let info = await doctorService.getDetailDoctorById(id);
    return res.status(200).json(info);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let info = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json({
      info,
    });
  } catch (error) {
    console.log(`error`, error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from the server',
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInfoDoctor: postInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
};
