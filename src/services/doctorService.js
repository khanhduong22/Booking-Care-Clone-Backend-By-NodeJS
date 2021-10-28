import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: 'R2' },
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: db.Allcode,
            as: 'positionData',
            attributes: ['valueEn', 'valueVi'],
          },
          {
            model: db.Allcode,
            as: 'genderData',
            attributes: ['valueEn', 'valueVi'],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errorCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: 'R2' },
        attributes: {
          exclude: ['password', 'image'],
        },
      });
      resolve({
        errorCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(`inputData`, inputData);
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note
      ) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      }

      //* create + update Markdown
      if (inputData.action === 'CREATE') {
        await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          description: inputData.description,
          doctorId: inputData.doctorId,
        });
        resolve({
          errorCode: 0,
          errorMessage: 'Save info doctor success',
        });
      }
      if (inputData.action === 'EDIT') {
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });

        if (doctorMarkdown) {
          doctorMarkdown.contentHTML = inputData.contentHTML;
          doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
          doctorMarkdown.description = inputData.description;
          doctorMarkdown.doctorId = inputData.doctorId;
          await doctorMarkdown.save();
          resolve({
            errorCode: 0,
            errorMessage: 'Edit info doctor success',
          });
        }
      }

      //* create + update to Doctor_Info
      let doctorInfo = await db.Doctor_Info.findOne({
        where: { doctorId: inputData.doctorId },
        raw: false,
      });

      //* update
      if (doctorInfo) {
        doctorInfo.doctorId = inputData.doctorId;
        doctorInfo.priceId = inputData.selectedPrice;
        doctorInfo.paymentId = inputData.selectedPayment;
        doctorInfo.provinceId = inputData.selectedProvince;
        doctorInfo.nameClinic = inputData.nameClinic;
        doctorInfo.addressClinic = inputData.addressClinic;
        doctorInfo.note = inputData.note;
        doctorInfo.specialtyId = inputData.specialtyId;
        doctorInfo.clinicId = inputData.clinicId;

        await doctorInfo.save();
      } else {
        //* create
        await db.Doctor_Info.create({
          doctorId: inputData.doctorId,
          priceId: inputData.selectedPrice,
          paymentId: inputData.selectedPayment,
          provinceId: inputData.selectedProvince,
          nameClinic: inputData.nameClinic,
          addressClinic: inputData.addressClinic,
          note: inputData.note,
          specialtyId: inputData.specialtyId,
          clinicId: inputData.clinicId,
        });
      }

      resolve({
        errorCode: 2,
        errorMessage: 'Fail from server',
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown'],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
            },
            {
              model: db.Allcode,
              as: 'genderData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: true,
          nest: true,
        });

        if (data?.image) {
          data.image = new Buffer(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};
        resolve({
          errorCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter!',
        });
      } else {
        let schedule = data.map((item) => {
          item.maxNumber = MAX_NUMBER_SCHEDULE;
          return item;
        });

        //*get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data[0].doctorId, date: data[0].date },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true,
        });

        //*compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //* create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        // console.log(`data`, data);
        resolve({
          errorCode: 0,
          message: 'Set schedule OK',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter!',
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: 'timeTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.User,
              as: 'doctorData',
              attributes: ['firstName', 'lastName'],
            },
          ],
          raw: true,
          nest: true,
        });

        if (!data) data = {};

        resolve({
          errorCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getExtraInfoDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: inputId },
          attributes: {
            exclude: ['id', 'doctorId'],
          },
          include: [
            {
              model: db.Allcode,
              as: 'priceData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'provinceData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'paymentData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],

          raw: true,
          nest: true,
        });

        if (!data) data = {};
        resolve({
          errorCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing parameter',
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
            },
          ],

          raw: true,
          nest: true,
        });

        if (data?.image) {
          data.image = new Buffer(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};
        resolve({
          errorCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllDoctors: getAllDoctors,
  getTopDoctorHome: getTopDoctorHome,
  saveDetailInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
};
