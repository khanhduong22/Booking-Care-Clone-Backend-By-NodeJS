import bcrypt from 'bcryptjs';
import db from '../models/index';

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExit = await checkUserEmail(email);
      if (isExit) {
        let user = await db.User.findOne({
          attributes: ['email', 'roleId', 'password'],
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

module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
};
