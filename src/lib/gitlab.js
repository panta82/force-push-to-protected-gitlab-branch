'use strict';

class GitLab {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
}

/**
 * @return {ParseRemoteUrlResult}
 */
function parseRemoteUrl(remoteUrl) {
  const gitMatch = /^git@([^:]+):([^/]+)\/([^.]+)\.git$/i.exec(remoteUrl);
  if (gitMatch) {
    return /** @lends {ParseRemoteUrlResult.prototype} */ {
      protocol: 'git',
      host: gitMatch[1],
      user: gitMatch[2],
      project: gitMatch[3],
    };
  }

  const httpMatch = /^(https?):\/\/([^/]+)\/([^/]+)\/([^/]+)/.exec(remoteUrl);
  if (httpMatch) {
    return {
      protocol: httpMatch[1],
      host: httpMatch[2],
      user: httpMatch[3],
      project: httpMatch[4],
    };
  }

  return null;
}

module.exports = {
  GitLab,

  parseRemoteUrl,
};
