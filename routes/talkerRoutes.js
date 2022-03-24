const express = require('express');

const router = express.Router();
const getSetTalker = require('../services/getSetData');
const validToken = require('./middlewares/validToken');

const nameAndAgeValid = (req, res, next) => {
  const { name, age } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res
    .status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400)
    .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const validDate = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
  return res.status(400)
  .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
} 
  const { watchedAt } = talk;
  const dataRegex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/; // referência: https://stackoverflow.com/questions/15491894/regex-to-validate-date-formats-dd-mm-yyyy-dd-mm-yyyy-dd-mm-yyyy-dd-mmm-yyyy
  const isWatchedAt = dataRegex.test(watchedAt);
  if (!watchedAt) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
    } 
  if (!isWatchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  if (rate === undefined) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

router.get('/', async (req, res) => {
  const talkers = await getSetTalker.getTalker();
  if (talkers.name === '') {
    return res.status(200).json([]);
  }
  return res.status(200).json(talkers);
});

router.get('/:id', async (req, res) => {
  const talkers = await getSetTalker.getTalker();
  console.log(talkers);
  const { id } = req.params;
  const getTalkerById = talkers.find((talker) => talker.id === +id);
  if (getTalkerById === undefined) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(getTalkerById);
});

router.post('/', validToken, nameAndAgeValid, validDate, validRate, async (req, res) => {
  const talkers = await getSetTalker.getTalker();
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = {
    name,
    age,
    id: talkers.length + 1,
    talk: {
      watchedAt,
      rate,
    },
  };
  const newTalker = [{ ...talkers }, talker];

  await getSetTalker.setTalker(newTalker);

  res.status(201).json(talker);
});

module.exports = router;

// if (!talk) {
//   return res.status(400)
//   .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
// } 
// const { talk: { watchedAt, rate } } = req.body;

// if (!talk.watchedAt || rate) {
//   return res.status(400)
//   .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
// } 
