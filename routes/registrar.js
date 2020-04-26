const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const Registrar = require('../models/Registrar');

const { authenticateJWT } = require('./login');


function asyncHandler(cb) {
  return async (req,res,next) => {
    try {
      await cb(req,res,next);
    } catch(err) {
      next(err);
    }
  }
}



router.get('/', authenticateJWT, asyncHandler(async (req, res) => {
  const registrars = await Registrar.find({}, '-__v');
  res.send(registrars);

}));

router.get('/:id', authenticateJWT, asyncHandler( async (req, res) => {
  const registrar = await Registrar.findOne({_id: req.params.id});
  res.send(registrar);
}));

router.post('/', authenticateJWT,[
    check('name').isString().trim(),
    check('callbackUrl').isString().trim(),
], asyncHandler( async (req,res) => {
  const registrar = new Registrar({
    name: req.body.name,
    callbackUrl: req.body.callbackUrl,
  });
  await registrar.save();
  res.send(registrar);
}));


router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Registrar.deleteOne({ _id: req.params.id });
    res.status(204).send()
  } catch {
    res.status(404);
    res.send({ error: "Registered service doesn't exist!" })
  }
});

module.exports = router;
