var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  if (email && password) {
    const user = await req.app.locals.db.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const authentic = await bcrypt.compare(password, user.password);
    if (!authentic) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000});

    // ensure that the password is not sent to the client
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: token,
    };
    res.json(userData);
  } else {
    return res.status(401).json({ error: 'Missing credentials' });
  }
});

router.post('/register', async function(req, res) {
  const { email, password, name } = req.body;
  const exist = await req.app.locals.db.user.findUnique({ where: { email } });
  if (exist) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await req.app.locals.db.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true },
  });

  res.json(newUser);
});

router.post('/logout', function(req, res) {
  res.clearCookie("token");
  res,json({ message: "Logged out"});
});

module.exports = router;
