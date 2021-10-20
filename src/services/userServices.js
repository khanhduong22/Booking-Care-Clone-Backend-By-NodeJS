import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExit = await checkUserEmail(email);
      if (isExit) {
        let user = await db.User.findOne({
          attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
          where: { email: email },
          raw: true,
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errorCode = 0;
            userData.errorMessage = 'OK';
            delete user.password;
            userData.user = user;
          } else {
            userData.errorCode = 3;
            userData.errorMessage = 'Wrong Password';
          }
        } else {
          userData.errorCode = 2;
          userData.errorMessage = `User not found!`;
        }
      } else {
        userData.errorCode = 1;
        userData.errorMessage = `Your's email isn't exit in your system! Please try again!`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = {};

      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password'],
          },
        });
      } else {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }

      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errorCode: 5,
          errorMessage: 'Missing data',
        });
      }
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errorCode: 1,
          errorMessage:
            'Your email is already in used, please try another email',
        });
      } else {
        let hashPasswordFromBcryptjs = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcryptjs,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
        });
      }
      resolve({
        errorCode: 0,
        errorMessage: 'OK',
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errorCode: 2,
          errorMessage: `The user isn't exit`,
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errorCode: 0,
        errorMessage: `The user is deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.firstName ||
        !data.lastName ||
        !data.address ||
        !data.roleId ||
        !data.positionId ||
        !data.gender
      ) {
        resolve({
          errorCode: 2,
          errorMessage: 'Missing input parameter!!',
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.phonenumber = data.phoneNumber;

        await user.save();

        // await db.User.save({
        //   firstName = data.firstName,
        //   lastName = data.lastName,
        //   address = data.address,
        // });
        resolve({
          errorCode: 0,
          errorMessage: 'Update user success!',
        });
      } else {
        resolve({
          errorCode: 1,
          errorMessage: `User's not found`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeServices = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing required parameter!',
        });
      } else {
        let res = {};

        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errorCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUser: getAllUser,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,

  getAllCodeServices: getAllCodeServices,
};
