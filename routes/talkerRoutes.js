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
  res.status(200).json(getTalkerById);
});

module.exports = router;
