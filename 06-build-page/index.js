const fs = require('fs');
const path = require('path');

const templateFile = path.join(__dirname, 'template.html');
const stylesDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const distDir = path.join(__dirname, 'project-dist');
const assetsDirOrig = path.join(__dirname, 'assets');
const assetsDir = path.join(distDir, 'assets');
const bundleFile = path.join(distDir, 'style.css');
const indexFile = path.join(distDir, 'index.html');

async function buildHtml(
  template,
  comDir,
  projectDir,
  indexFile,
  stylesDir,
  bundleFile,
) {
  try {
    let templateData = await fs.promises.readFile(template, 'utf-8');
    let substrStartPos = 0;
    let substrFinishPos = 0;
    let startPos = [];
    let finishPos = [];
    let componentsArr = {};
    let tag = '';
    let cssData = '';

    do {
      startPos.push(templateData.indexOf('{{', substrStartPos));
      substrStartPos = templateData.indexOf('{{', substrStartPos) + 2;

      if (templateData.indexOf('}}', substrFinishPos) === -1) {
        console.log('Error in template.html!');
        console.log('Check order of brackets "{}"!');
        return;
      }
      finishPos.push(templateData.indexOf('}}', substrFinishPos));
      substrFinishPos = templateData.indexOf('}}', substrFinishPos) + 2;
    } while (templateData.indexOf('{{', substrStartPos) !== -1);

    for (let i = 0; i < startPos.length; i += 1) {
      tag = templateData.slice(startPos[i] + 2, finishPos[i]);
      componentsArr[tag] = await fs.promises.readFile(
        `${comDir}/${tag}.html`,
        'utf-8',
      );
    }

    for (let key in componentsArr) {
      templateData = templateData.replace(`{{${key}}}`, componentsArr[key]);
    }

    await fs.promises.rm(projectDir, { recursive: true, force: true });
    await fs.promises.mkdir(projectDir);

    fs.promises.writeFile(indexFile, templateData);

    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.css') {
        continue;
      }
      cssData += await fs.promises.readFile(
        path.join(stylesDir, file.name),
        'utf-8',
      );
      cssData += '\n';
    }

    fs.promises.writeFile(bundleFile, cssData);

    copyAssets(assetsDirOrig, assetsDir);
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets(dir, dirCopy) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    await fs.promises.rm(dirCopy, { recursive: true, force: true });
    await fs.promises.mkdir(dirCopy);

    for (let file of files) {
      if (file.isFile()) {
        fs.promises.copyFile(
          path.join(dir, file.name),
          path.join(dirCopy, file.name),
        );
      } else {
        copyAssets(path.join(dir, file.name), path.join(dirCopy, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildHtml(
  templateFile,
  componentsDir,
  distDir,
  indexFile,
  stylesDir,
  bundleFile,
);
