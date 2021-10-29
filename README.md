# React Electron Starter Kit

This is an **experimental** starter kit for a React Electron app.

# Features

1. [`electron-reload`](https://www.npmjs.com/package/electron-reload) for the main process (in dev)
2. HMR for the renderer process (in dev)
3. [TypeScript](https://www.typescriptlang.org/)
4. [React Router](https://reacttraining.com/react-router/), routes automatically generated and localized
5. [Redux](https://redux.js.org/introduction)
6. [Polyglot](http://airbnb.io/polyglot.js/)
7. [Styled Components](https://www.styled-components.com/)
8. [React Transition Group](http://reactcommunity.org/react-transition-group/)
9. [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/) config

# Usage

```sh
# Install dependencies
$ npm install

# Run in dev
$ npm run dev
```

See `scripts` in `package.json` for additional commands.

## Production Logging

By default, logs are written to the following locations:

- on Linux: `~/.config/{app name}/logs/{process type}.log`
- on OS X: `~/Library/Logs/{app name}/{process type}.log`
- on Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`
