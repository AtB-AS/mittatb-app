# Windows Setup

> [!NOTE]
> Since iOS development is only supported on MacOS, we recommend using MacOS for development. These are some workarounds to get the Android app running on Windows with WSL, but since it's not regularly done by the core team, there are no guarantees that this is up to date.

Follow the steps in [README.md](../README.md) to set up the development environment, while keeping the following in mind:

- Use Git Bash to run any bash scripts and `yarn` commands
- `git-crypt` can be used through WSL
- Install ImageMagick from [here](https://imagemagick.org/script/download.php).
  - Check `Install legacy utilities (e.g. convert)` during the installation.
  - Then add `C:\Program Files\ImageMagick-7.1.1-Q16-HDRI` (or similar) to PATH.
- Install Ruby from [here](https://rubyinstaller.org/downloads/)
  - Add `C:\Ruby27-x64\bin` (or similar) to PATH.

Since we're only building the Android app, you can skip any iOS specific steps:

- Installing iOS Pods
- Running `yarn get_ios_certs`
- And `yarn ios`
