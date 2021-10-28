import specialtyService from '../services/specialtyService';

let createNewSpecialty = async (req, res) => {
  try {
    let data = req.body;
    let result = await specialtyService.createNewSpecialty(data);
    return res.status(200).json(result);
  } catch (error) {
    console.log('Get all code error: ', error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from server',
    });
  }
};

let getSpecialty = async (req, res) => {
  try {
    let result = await specialtyService.getSpecialty();
    return res.status(200).json(result);
  } catch (error) {
    console.log('Get all code error: ', error);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: 'Error from server',
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let result = await specialtyService.getDetailSpecialtyById(
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
  createNewSpecialty,
  getSpecialty,
  getDetailSpecialtyById,
};
