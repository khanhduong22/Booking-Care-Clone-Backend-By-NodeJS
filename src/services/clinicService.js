import db from '../models/index';
let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address
      ) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing input parameter!!',
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errorCode: 0,
          errorMessage: 'OK',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data?.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, 'base64').toString('binary');
          return item;
        });
      }
      resolve({
        errorCode: 0,
        errorMessage: 'OK',
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing input parameter!!',
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            'name',
            'address',
            'descriptionHTML',
            'descriptionMarkdown',
          ],
        });
        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Info.findAll({
            where: { clinicId: inputId },
            attributes: ['doctorId', 'provinceId'],
          });
          data.doctorClinic = doctorClinic;
        }
        resolve({
          errorCode: 0,
          errorMessage: 'OK',
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewClinic,
  getClinic,
  getDetailClinicById,
};
