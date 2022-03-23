const express = require('express');

const router = express.Router();
const generateToken = require('../services/tokenGeenerate');

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /\S+@\S+\.\S+/; // Referência: https://www.horadecodar.com.br/2020/09/07/expressao-regular-para-validar-e-mail-javascript-regex/
  const isEmailValid = emailRegex.test(email);

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!isEmailValid) { 
    return res.status(400)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 5) {
    return res.status(400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
    const token = generateToken();
  
  res.status(200).json({ token });
});

module.exports = router;