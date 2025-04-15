var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // const token = req.cookies.token;
  const token = req.headers['authorization'].split(' ')[1];;
  console.log("Received")
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

router.get('/home', function(req, res) {
  const data = {
    stats: {
      simulations: {
        value: '10',
        progress: 12,
      },
      successful: {
        value: '89.9%',
        progress: 75,
      },
      times: {
        value: '89.9%',
        progress: 75,
      },
    },
    routines: [
      {
        id: '1232323',
        name: 'My first routine',
        time: '10 sec ago',
        obstacle: 'Gator tooth',
        steps: 10,
        latestRun: 'Jan 1, 2023',
      },
      {
        id: '1232324',
        name: 'My first routine',
        time: '10 sec ago',
        obstacle: 'Gator tooth',
        steps: 10,
        latestRun: 'Jan 1, 2023',
      },
      {
        id: '1232325',
        name: 'My first routine',
        time: '10 sec ago',
        obstacle: 'Gator tooth',
        steps: 10,
        latestRun: 'Jan 1, 2023',
      },
      {
        id: '1232326',
        name: 'My first routine',
        time: '10 sec ago',
        obstacle: 'Gator tooth',
        steps: 10,
        latestRun: 'Jan 1, 2023',
      },
    ],
    maps: [
      {
        id: '8293282',
        name: 'Gattor Tooth',
        description: 'A small map designed to introduce the application to the player',
        obstacles: 0,
        size: 9,
      },
    ],
  };

  res.json(data);
})



module.exports = router;
