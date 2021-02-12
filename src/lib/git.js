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
      console.error(stderr);
    }
    return stdout.trim();
  }

  async getCurrentBranch() {
    return this._exec(`git branch --format '%(refname:short)'`);
  }

  async pickRemote() {
    const remotesStr = await this._exec(`git remote`);
    const remotes = remotesStr.split(/\r\n|\n\r|\n|\r/).map(r => r.trim());
    return remotes.includes('origin') ? 'origin' : remotes[0];
  }

  async getRemoteUrl(remoteName) {
    return this._exec(`git config --get remote.${remoteName}.url`);
  }
}

module.exports = {
  Git,
};
