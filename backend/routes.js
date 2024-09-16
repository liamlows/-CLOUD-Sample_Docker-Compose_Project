const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Dynamic Get
router.get('/api/d/:table', async (req, res, next) => {
  try{
      await controller.get(req, res);
  } catch(error){
      return next(error);
  } 
});

router.get('/api/d/:table/:variable', async (req, res, next) => {
  try{
      await controller.get(req, res);
  } catch(error){
      return next(error);
  } 
});
router.get('/api/d/:table/:variable/:value', async (req, res, next) => {
  try{
      await controller.get(req, res);
  } catch(error){
      return next(error);
  } 
});


// Dynamic Post
// /api/d/{table}/post
router.post('/api/d/:table/:variable/:value', async (req, res, next) => {
  try{
    await controller.post(req, res);
  } catch(error){
    return next(error);
  }
});

// Dynamic Put
// /api/d/{table}/{variable}/put
router.put('/api/d/:table/:variable/:value', async (req, res, next) => {
  try{
    await controller.put(req, res);
  } catch(error){
    return next(error);
  }
});

// Dynamic Delete
// /api/d/{table}/{variable}/delete
router.delete('/api/d/:table/:variable/:value', async (req, res, next) => {
  try{
    await controller.delete(req, res);
  } catch(error){
    return next(error);
  }
});

//RESET table
router.delete('/reset/courses', async (req, res, next) => {
  try{
    await controller.resetCourses(req, res);
  } catch(error){
    return next(error);
  }
})

// POPULATE COURSES
router.post('/populate/courses/', async (req, res, next) => {
  try{
    await controller.populateCourses(req, res);
  } catch(error){
    return next(error);
  }
});

// POPULATE ACCOUNTS
router.post('/populate/accounts/', async (req, res, next) => {
  try{
    await controller.populateAccounts(req, res);
  } catch(error){
    return next(error);
  }
});

module.exports = router;