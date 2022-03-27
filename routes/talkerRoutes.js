const express = require('express');

const router = express.Router();
const getSetTalker = require('../services/getSetData');
const {
  validToken,
  nameAndAgeValid,
  validDate,
  validRate,
} = require('../middlewares');

router.get('/', async (req, res) => {
  const talkers = await getSetTalker.getTalker();
  if (talkers.name === '') {
    return res.status(200).json([]);
  }
  return res.status(200).json(talkers);
});

router.get('/:id', async (req, res) => {
  const talkers = await getSetTalker.getTalker();
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

router.put(('/:id'), validToken, nameAndAgeValid, validDate, validRate, async (req, res) => {
  const talkers = await getSetTalker.getTalker();
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const getTalkerByIndex = talkers.findIndex((talker) => talker.id === +id);
  const editTalker = talkers[getTalkerByIndex];
  const editedTalker = {
    ...editTalker,
    name,
    age,
    talk: { 
      watchedAt: talk.watchedAt,
      rate: talk.rate,
    },
  };
  
  talkers.push(editedTalker);
  await getSetTalker.setTalker(talkers);
  return res.status(200).json(editedTalker);
});

module.exports = router;
