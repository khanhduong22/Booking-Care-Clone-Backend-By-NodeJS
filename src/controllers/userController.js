import userServices from '../services/userServices';

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: 'Missing inputs parameter!!!',
    });
  }

  let userData = await userServices.handleUserLogin(email, password);

  return res.status(200).json({
    errorCode: userData.errorCode,
    message: userData.errorMessage,
    user: userData.user ? userData.user : {},
  });
};

let getAllUser = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(500).json({
      errorCode: 1,
      message: 'Missing inputs parameter!!!',
    });
  }

  let users = await userServices.getAllUser(id);

  return res.status(200).json({
    errorCode: 0,
    errorMessage: 'OK',
    users,
  });
};

let createNewUser = async (req, res) => {
  let message = await userServices.createNewUser(req.body);
  return res.status(200).json(message);
};

let editUser = async (req, res) => {
  let data = req.body;
  let message = await userServices.updateUserData(data);

  return res.status(200).json(message);
};

let deleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errorCode: 1,
      errorMessage: 'Missing required parameters!!',
    });
  }
  let message = await userServices.deleteUser(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleLogin: handleLogin,
  getAllUser: getAllUser,
  createNewUser: createNewUser,
  editUser: editUser,
  deleteUser: deleteUser,
};
