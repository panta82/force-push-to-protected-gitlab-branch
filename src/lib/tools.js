'use strict';

const libFs = require('fs');
const readline = require('readline');
const Writable = require('stream').Writable;

function loadEnvFileSync(envPath) {
  const result = {};
  try {
    const content = libFs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r\n|\n\r|\r|\n/);
    for (let line of lines) {
      line = line.trim();
      if (line[0] === '#') {
        continue;
      }
      const [key, value] = line.split('=');
      if (value) {
        result[key] = value;
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to read env file at "${envPath}"`, err);
    }
  }
  return result;
}

async function passwordPrompt(prompt) {
  return new Promise(resolve => {
    let muted = false;
    const mutableStdOut = new Writable({
      write: function (chunk, encoding, callback) {
        if (!muted) {
          process.stdout.write(chunk, encoding);
        }
        callback();
      },
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdOut,
      terminal: true,
    });

    rl.on('close', () => {
      if (resolve) {
        console.log();
        resolve(null);
        resolve = null;
      }
    });

    rl.question(`${prompt} > `, password => {
      muted = false;
      if (resolve) {
        console.log();
        resolve(password);
        resolve = null;
      }
      rl.close();
    });

    muted = true;
  });
}

async function questionPrompt(prompt) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    rl.on('close', () => {
      if (resolve) {
        console.log();
        resolve(null);
        resolve = null;
      }
    });

    rl.question(`${prompt} > `, answer => {
      answer = answer.trim();
      if (resolve) {
        resolve(answer);
        resolve = null;
      }
      rl.close();
    });
  });
}

module.exports = {
  loadEnvFileSync,
  passwordPrompt,
  questionPrompt,
};
