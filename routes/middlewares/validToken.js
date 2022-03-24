const validToken = (req, res, next) => {
  const { authorization } = req.headers;
  const tokenRegex = /^[a-fA-F0-9]{16}$/;
  const isValidToken = tokenRegex.test(authorization);
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  
  if (!isValidToken) return res.status(401).json({ message: 'Token inválido' });

  next();
};

module.exports = validToken;
