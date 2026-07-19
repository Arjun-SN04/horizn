const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { reportSchema } = require('../schema');
const { isLoggedIn } = require('../middleware');
const reportController = require('../controllers/reports');

const validateReport = (req, res, next) => {
  const { error } = reportSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    return next(new ExpressError(400, msg));
  }
  next();
};

router.post('/', isLoggedIn, validateReport, wrapAsync(reportController.createReport));

module.exports = router;
