const fs = require('fs');
const path = require('path');
const writeFile = path.join(__dirname, 'out.txt');
const output = fs.createWriteStream(writeFile);
const { stdin, stdout } = process;
const helloText = () => stdout.write('Input some text, please:\n');

helloText();
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    stdout.write('Goodbye!');
    process.exit();
  } else {
    output.write(data);
    stdout.write('Your text is written!\n');
    helloText();
  }
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit();
});
