import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render('homepage.ejs', {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  res.send('User is create successfully');
};
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render('displayCRUD.ejs', {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  // console.log(userId);
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);

    return res.render('editCRUD.ejs', {
      userData: userData,
    });
  } else {
    return res.send('User not found !!!!!!!');
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  // let allUsers = await CRUDService.updateUserData(data);
  await CRUDService.updateUserData(data);
  // return res.render('displayCRUD.ejs', {
  //   dataTable: allUsers,
  // });
  return res.redirect('get-crud');
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send('Delete user success');
  } else {
    return res.send('User not found');
  }

  // return res.redirect('get-crud');
};
module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
