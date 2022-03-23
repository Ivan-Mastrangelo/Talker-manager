const fs = require('fs').promises;
const path = require('path');

async function getTalker() {
  const fileContent = await fs.readFile(path.join(__dirname, '../talker.json'), 'utf-8');
    return JSON.parse(fileContent);
}

function setTalker(newTalker) {
  return fs.writeFile('./talker.json', JSON.stringify(newTalker));
}

module.exports = { getTalker, setTalker };