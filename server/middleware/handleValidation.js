const { validationResult } = require("express-validator");

/**
 * Collects express-validator results and short-circuits with a 400
 * response when any rule fails. Placed right after a validator chain
 * so controllers stay free of validation boilerplate.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = handleValidation;
