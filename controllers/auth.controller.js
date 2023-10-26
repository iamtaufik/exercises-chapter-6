const prisma = require('../libs/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      return res.status(400).json({ error: 'Missing name or email' });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(req.body.password, 10),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      return res.status(400).json({ error: 'Missing name or email' });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, message: 'User logged in successfully', data: { accessToken: token } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const authenticate = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        profile: true,
      },
    });
    delete user.password;
    res.status(200).json({ success: true, message: 'User authenticated successfully', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  authenticate,
};
