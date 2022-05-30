const {execSync} = require('child_process');

const latestReleaseTag = execSync(
  `git tag --sort=creatordate |  grep -E '(^alpha-.*)|(^v.*)|(.*nfk.*)' | tail -1`,
)
  .toString('utf-8')
  .trim();

module.exports = {
  gitRawCommitsOpts: {
    from: latestReleaseTag,
    to: 'HEAD',
  },
};
