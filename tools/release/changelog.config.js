const {execSync} = require('child_process');

const latestReleaseTag = execSync(
  `git tag --sort=creatordate | grep -E '(^alpha-.*)|(^v.*)' | grep -vE '(atb|nfk|fram|troms)' | tail -1`,
)
  .toString('utf-8')
  .trim();

module.exports = {
  gitRawCommitsOpts: {
    from: latestReleaseTag,
    to: 'HEAD',
  },
};
