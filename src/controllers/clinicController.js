import clinicService from '../services/clinicService';

let createNewClinic = async (req, res) => {
  try {
    let data = req.body;
    let result = await clinicService.createNewClinic(data);
    return res.status(200).json(result);
  } catch (error) {
    console.log('Get all code error: ', error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from server',
    });
  }
};

let getClinic = async (req, res) => {
  try {
    let result = await clinicService.getClinic();
    return res.status(200).json(result);
  } catch (error) {
    console.log('Get all code error: ', error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from server',
    });
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let result = await clinicService.getDetailClinicById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log('Get all code error: ', error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from server',
    });
  }
};

module.exports = {
  createNewClinic,
  getClinic,
  getDetailClinicById,
};
