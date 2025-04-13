var express = require('express');
var router = express.Router();

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Stranger danger!" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // attaching the user id to the request object, this will make it available in the endpoint
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Stranger danger!" });
  }
};

/**
 * This rout is passed through when an authenticated endpoint is called. Including
 * get, post, put, delete
 */
router.use('/*', requireAuth);

module.exports = router;
