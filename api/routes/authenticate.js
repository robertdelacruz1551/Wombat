var express = require('express');
var router = express.Router();

router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
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
  };

  res.json(userData);
});

router.post('/register', async function(req, res) {
  const { email, password, name } = req.body;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
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
