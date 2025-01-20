const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

async function getFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    let fileName = '';
    let lastInd = 0;
    let fileExt = '';
    let fileSize = '';
    for (const file of files) {
      if (!file.isFile()) {
        continue;
      }

      lastInd = file.name.lastIndexOf('.');
      fileName = file.name.slice(0, lastInd);
      fileExt = path.extname(file.name);

      const stat = await fs.promises.stat(path.join(dir, file.name));

      fileSize = stat.size + 'B';

      console.log(`${fileName} - ${fileExt} - ${fileSize}`);
    }
  } catch (err) {
    console.error(err);
  }
}

getFiles(pathToDir);
