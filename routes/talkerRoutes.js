const express = require('express');

const router = express.Router();
const getSetTalker = require('../services/getSetData');

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

router.post('/', async (req, res) => {
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
