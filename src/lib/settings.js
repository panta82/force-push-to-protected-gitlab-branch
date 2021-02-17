'use strict';

const libFs = require('fs');
const libUtil = require('util');

const $loaded = Symbol('settings_file_loaded');

/**
 * @return {Promise<ISettings>}
 */
async function loadSettingsFile(settingsPath) {
  let result;
  try {
    const json = await libUtil.promisify(libFs.readFile)(settingsPath, 'utf8');
    result = JSON.parse(json);
    result.$loaded = $loaded;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to read settings file at "${settingsPath}"`, err);
    }
    result = {};
  }

  if (!result.tokens) {
    result.tokens = {};
  }

  return result;
}

/**
 * @param settingsPath
 * @param {ISettings} settings
 */
async function writeSettingsFile(settingsPath, settings) {
  const json = JSON.stringify(settings, null, '  ');
  await libUtil.promisify(libFs.writeFile)(settingsPath, json, 'utf8');
  return true;
}

module.exports = {
  loadSettingsFile,
  writeSettingsFile,
};
