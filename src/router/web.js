import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';

let router = express.Router();

let initWebRoutes = (app) => {
  //homepage
  router.get('/', homeController.getHomePage);

  //create
  router.get('/CRUD', homeController.getCRUD);
  router.post('/post-crud', homeController.postCRUD);
  //read
  router.get('/get-crud', homeController.displayGetCRUD);
  //update
  router.get('/edit-crud', homeController.getEditCRUD);
  router.post('/put-crud', homeController.putCRUD);
  //delete
  router.get('/delete-crud', homeController.deleteCRUD);

  //RESTFUL API
  router.post('/api/login', userController.handleLogin);
  router.get('/api/get-all-user', userController.getAllUser);
  router.post('/api/create-new-user', userController.createNewUser);
  router.put('/api/edit-user', userController.editUser);
  router.delete('/api/delete-user', userController.deleteUser);

  //allcode API
  router.get('/api/allcode', userController.getAllCode);

  //home API
  router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
  //admin doctor
  router.get('/api/get-all-doctors', doctorController.getAllDoctors);
  router.post('/api/save-info-doctors', doctorController.postInfoDoctor);
  router.get(
    '/api/get-detail-doctor-by-id',
    doctorController.getDetailDoctorById
  );

  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  router.get('/api/get-schedule-doctors', doctorController.getScheduleByDate);

  return app.use('/', router);
};
module.exports = initWebRoutes;
