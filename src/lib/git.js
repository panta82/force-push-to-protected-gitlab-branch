'use strict';

const libUtil = require('util');

const nodeExec = libUtil.promisify(require('child_process').exec);

class Git {
  constructor(cwd, debugLog = false) {
    this.cwd = cwd;
    this.debugLog = debugLog;
  }

  async _exec(cmd) {
    if (this.debugLog) {
      console.log(`> ${cmd}`);
    }

    const { stdout, stderr } = await nodeExec(cmd, {
      cwd: this.cwd,
    });
    if (stderr && stderr.trim()) {
      console.error(stderr.trim());
    }
    return stdout.trim();
  }

  async getCurrentBranch() {
    return this._exec(`git rev-parse --abbrev-ref HEAD`);
  }

  async pickRemote() {
    const remotesStr = await this._exec(`git remote`);
    const remotes = remotesStr.split(/\r\n|\n\r|\n|\r/).map(r => r.trim());
    return remotes.includes('origin') ? 'origin' : remotes[0];
  }

  async getRemoteUrl(remoteName) {
    return this._exec(`git config --get remote.${remoteName}.url`);
  }

  async push(force = false) {
    return this._exec(`git push ${force ? '--force' : ''}`);
  }
}

module.exports = {
  Git,
};
