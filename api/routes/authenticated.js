var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // const token = req.cookies.token;
  const token = req.headers['authorization'].split(' ')[1];;
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

router.post('/ping', function(req, res) {
  res.status(200).json({});
})

router.get('/home/:id', async function(req, res) {
  const user = Number(req.params.id);

  const maps = await req.app.locals.db['map'].findMany({
    select: {
      id: true,
      title: true,
      description: true,
      board: true,
    }
  });
  const routines = await req.app.locals.db.simulations.findMany({
    where: { user: user },
    select: {
      id: true,
      user: true,
      map: true,
      time: true,
      obstacles: true,
      steps: true,
      success: true,
    },
  });

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
    routines: routines,
    maps: maps,
  }
  res.json(data);
})

router.post('/profile', async function(req, res) {
  const id = Number(req.body.id);
  const data = await req.app.locals.db.user.findUnique({
    where: { id: id },
    select: {
      name: true,
      email: true,
      bio: true,
    }
  });
  res.json(data);  
})

router.get('/map/:id', async function(req, res) {
  const id = Number(req.params.id);
  const data = await req.app.locals.db['map'].findUnique({ where: { id: id } });
  res.json(data);  
})

router.put('/simulation-save', async function(req, res) {
  const { user, map, time, obstacles, steps, success } = req.body;
  const record = await req.app.locals.db.simulations.create({
    data: {
      user: user, 
      map: map, 
      time: time, 
      obstacles: obstacles, 
      steps: steps, 
      success: success
    },
    select: {
      user: true, 
      map: true, 
      time: true, 
      obstacles: true, 
      steps: true, 
      success: true
    }
  })
  res.json(record);
})

router.put('/profile-save', async function(req, res) {
  try {
    const { id, name, email, bio } = req.body;
    const status = 'Active';
    const record = await req.app.locals.db.user.update({
      where: {id: Number(id)},
      data: {
        name: name,
        email: email,
        bio: bio,
        status: status,
      },
      select: {
        name: true,
        email: true,
        bio: true,
        status: true,
      }
    })
    res.json(record);
  } catch (error) {
    res.status(404).json({})
  }
})

router.get('/administrator/users', async function(req, res) {
  const data = await req.app.locals.db.user.findMany();
  res.json(data);
})

router.put('/administrator/user-status-change', async function(req, res) {
  try {
    const { id, curr } = req.body;
    const nstatus = curr === 'Active'? 'Deactivated' : curr
    const record = await req.app.locals.db.user.update({
      where: {id: Number(id)},
      data: {
        status: nstatus,
      }
    })
    res.json(record);
  } catch (error) {
    res.status(404).json({})
  }
})

router.get('/administrator/maps', async function(req, res) {
  const data = await req.app.locals.db['map'].findMany();
  res.json(data);
})

router.get('/administrator/maps/editor/:id', async function(req, res) {  
  const id = Number(req.params.id);
  const defaultrec = {
    id: id,
    title: '',
    description: '',
    board: {
      layout: [[[0]]],
      start: [0,0],
      end: [0,0],
      current: [0,0],
      obstacles: 0,
    },
  };
  if (id != undefined && id !=0) {
    const data = await req.app.locals.db['map'].findUnique({ where: { id: id } });
    if (!data) {
      return res.status(404).json(defaultrec);
    } else {
      res.json(data);
    }
  } else {
    res.json(defaultrec);
  }
})

router.post('/administrator/maps/editor/:id', async function(req, res) {
  try {
    const { id, title, description, board } = req.body;
    if (Number(id) === 0) {
      const record = await req.app.locals.db['map'].create({
        data: {
          title: title,
          description: description,
          board: board,
        },
        select: {
          id: true,
          title: true,
          description: true,
          board: true,
        }
      })
      res.json(record);
    } else {
      const record = await req.app.locals.db['map'].update({
        where: {id: Number(id)},
        data: {
          title: title,
          description: description,
          board: board,
        },
        select: {
          id: true,
          title: true,
          description: true,
          board: true,
        }
      })
      res.json(record);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({});
  }
})

module.exports = router;
