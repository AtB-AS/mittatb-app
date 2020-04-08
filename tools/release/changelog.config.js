const {execSync} = require('child_process');

const latestAlphaReleaseTag = execSync(
  `git tag --sort=committerdate | grep -E '^alpha-.*'  | tail -1`,
)
  .toString('utf-8')
  .trim();

module.exports = {
  gitRawCommitsOpts: {
    from: latestAlphaReleaseTag,
    to: 'HEAD',
  },
};
