const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function cssMerge(srcDir) {
  let cssData = '';

  try {
    const files = await fs.promises.readdir(srcDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.css') {
        continue;
      }

      cssData += await fs.promises.readFile(
        path.join(srcDir, file.name),
        'utf-8',
      );
      cssData += '\n';
    }

    fs.promises.writeFile(bundleFile, cssData);
  } catch (err) {
    console.error(err);
  }
}

cssMerge(stylesDir, bundleFile);
