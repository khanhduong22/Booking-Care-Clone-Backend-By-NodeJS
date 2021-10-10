import express from 'express';
import homeController from '../controllers/homeController';
let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/', homeController.getHomePage);
  router.get('/why', (req, res) => res.send('tại sao không?'));
  // router.  get('/', (req, res) => res.send('có vấn đề gì à?'));
  return app.use('/', router);
};
module.exports = initWebRoutes;
