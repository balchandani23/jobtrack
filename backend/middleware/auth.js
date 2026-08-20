const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

module.exports = auth;