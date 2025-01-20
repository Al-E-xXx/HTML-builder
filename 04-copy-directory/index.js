const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'files');
const pathToDirCopy = path.join(__dirname, 'files-copy');

async function copyDir(dir, dirCopy) {
  let filesNames = [];
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile()) {
        continue;
      }
      filesNames.push(file.name);
    }

    await fs.promises.rm(dirCopy, { recursive: true, force: true });
    await fs.promises.mkdir(dirCopy);

    for (let file of filesNames) {
      fs.promises.copyFile(path.join(dir, file), path.join(dirCopy, file));
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir(pathToDir, pathToDirCopy);
