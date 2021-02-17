'use strict';

const BRANCH_ACCESS_LEVEL_LABELS = {
  0: 'No one',
  30: 'Developers',
  40: 'Maintainers',
  60: 'Admin',
};

class GitLab {
  constructor(accessToken, host, protocol = 'https', logRequests = false) {
    this._baseUrl = `${protocol || 'https'}://${host}/api/v4`;
    this._accessToken = accessToken;
    this._logRequests = logRequests;
  }

  async _request(method, path, query = undefined) {
    let url = `${this._baseUrl}${path}`;

    if (query) {
      const segments = [];
      for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          segments.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
        }
      }
      url += `?${segments.join('&')}`;
    }

    if (this._logRequests) {
      console.log(`[GITLAB] ${method} ${url}`);
    }

    return fetch(url, {
      method,
      headers: {
        'PRIVATE-TOKEN': this._accessToken,
      },
    });
  }

  /**
   * @return {Promise<IProtectedBranch>}
   */
  async getBranchProtection(projectId, branchName) {
    return this._request(
      'GET',
      `/projects/${encodeURIComponent(projectId)}/protected_branches/${encodeURIComponent(
        branchName
      )}`
    );
  }

  async unprotectBranch(projectId, branchName) {
    return this._request(
      'DELETE',
      `/projects/${encodeURIComponent(projectId)}/protected_branches/${encodeURIComponent(
        branchName
      )}`
    );
  }

  /**
   * @param projectId
   * @param {IProtectBranchPayload} payload
   */
  async protectBranch(projectId, payload) {
    return this._request(
      'POST',
      `/projects/${encodeURIComponent(projectId)}/protected_branches`,
      payload
    );
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

/**
 * @param {string|URL} url
 * @param {{auth, method, body, headers}} options
 * @returns {Promise<*>}
 */
function fetch(url, options = {}) {
  const libHttp = url.toString().startsWith('http://') ? require('http') : require('https');
  return new Promise((resolve, reject) => {
    const headers = options.headers || {};
    let body = options.body;
    const isStream = body && typeof body.pipe === 'function';
    if (body && typeof body === 'object' && !isStream) {
      try {
        body = JSON.stringify(body);
      } catch (err) {
        return reject(err);
      }
      headers['content-type'] = 'application/json';
    }
    const chunks = [];
    const req = libHttp.request(url, { ...options, headers }, res => {
      res.on('data', chunk => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        let result = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || '';
        if (contentType.startsWith('text')) {
          return resolve(result.toString('utf8'));
        }
        try {
          result = JSON.parse(result.toString('utf8'));
        } catch (_) {}

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (isStream) {
      body.pipe(req);
    } else {
      if (body) {
        req.write(body);
      }
      req.end();
    }
  });
}

module.exports = {
  BRANCH_ACCESS_LEVEL_LABELS,

  GitLab,

  parseRemoteUrl,
};
