const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

const replacements = {
  'rep-mayor-sheffield': 'rep-mayor-duggan',
  'rep-council-president-tate': 'rep-council-d1-tate',
  'rep-council-d5-miller': 'rep-council-d5-sheffield',
  'rep-council-d7-mccampbell': 'rep-council-d7-durhal',
  'rep-ussenate-slotkin': 'rep-ussenate-stabenow'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      for (const [oldId, newId] of Object.entries(replacements)) {
        if (content.includes(oldId)) {
          content = content.replaceAll(oldId, newId);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated IDs in ${file}`);
      }
    }
  }
}

processDir(dataDir);
