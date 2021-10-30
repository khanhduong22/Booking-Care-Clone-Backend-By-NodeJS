import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';

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

  router.post('/api/send-remedy', doctorController.sendRemedy);

  //extra info doctor
  router.get(
    '/api/get-extra-info-doctor-by-id',
    doctorController.getExtraInfoDoctorById
  );
  router.get(
    '/api/get-profile-doctor-by-id',
    doctorController.getProfileDoctorById
  );
  router.get(
    '/api/get-list-patient-for-doctor',
    doctorController.getListPatientForDoctor
  );

  //patient
  router.post(
    '/api/patient-book-appointment',
    patientController.patientBookAppointment
  );

  router.post('/verify-booking', patientController.verifyBookAppointment);

  //specialty
  router.post(
    '/api/create-new-specialty',
    specialtyController.createNewSpecialty
  );
  router.get('/api/get-specialty', specialtyController.getSpecialty);
  router.get(
    '/api/get-detail-specialty-by-id',
    specialtyController.getDetailSpecialtyById
  );

  //clinic
  router.post('/api/create-new-clinic', clinicController.createNewClinic);
  router.get('/api/get-clinic', clinicController.getClinic);
  router.get(
    '/api/get-detail-clinic-by-id',
    clinicController.getDetailClinicById
  );

  return app.use('/', router);
};
module.exports = initWebRoutes;
