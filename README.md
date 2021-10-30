# React Electron Starter Kit [![CI](https://github.com/andrewscwei/react-electron-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-electron-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-electron-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-electron-starter-kit/actions?query=workflow%3ACD)

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

# Build app for host platform
$ npm run make
```

See `scripts` in `package.json` for additional commands.

# Code Signing

## macOS

> For more details see https://www.electronjs.org/docs/latest/tutorial/code-signing and https://github.com/electron/electron-osx-sign/wiki/1.-Getting-Started#certificates

When distributing an Electron app for macOS, you need to code-sign and notarize it in order for it to clear macOS security. To do so, you need to prepare the following:
1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/)
2. Make note of your team ID
    1. Log in to [Member Center](https://developer.apple.com/membercenter/)
    2. Go to **Membership**
    3. You will see it under **Team ID**
3. Create a Certificate Signing Request (CSR), which will be required for generating code-signing certificates in the next step:
    1. On your Mac, open **Keychain Access** app
    2. Go to **Keychain Access** > **Certificate Assitant** > **Request a Certificate From a Certificate Authority**
    3. A dialog will appear, enter the email address registered with your Apple Developer Program account under **User Email Address**
    4. Under **Request is**, select **Saved to disk**
    5. Leave everything else blank
    6. Click **Continue**
    7. Save the `.certSigningRequest` file somewhere
3. Generate code-signing certificates:
    1. Log in to [Member Center](https://developer.apple.com/membercenter/)
    2. Go to **Certificates, Identifiers & Profiles**
    3. Under **Certificates**, click the plus button
    4. Select one of the following:
        1. **Developer ID Application** (`Developer ID Application: * (*)`) or **Developer ID Installer** (`Developer ID Installer: * (*)`) for distribution outside the Mac App Store
        2. **Mac App Distribution** (`3rd Party Mac Developer Application: * (*)`) or **Mac Installer Distribution** (`3rd Party Mac Developer Installer: * (*)`) for distribution inside the Mac App Store
    5. Upon clicking **Continue**, you will be prompted to upload a CSR file, so select the `.certSigningRequest` file you just created
    6. Once the certificate is created, download it and open it with the **Keychain Access** app on your Mac
    7. When you have both certificates in **Keychain Access**, select both, then right click and export both items to a `.p12` file
    8. Provide a secure password, make note of this password
    9. Encode the `.p12` file to base-64 string: `base64 -i certificate.p12`
4. Prepare the following environment variables for later use (i.e. in the CI environment):
    ```sh
    # Apple ID (email) with a registered developer account
    MAC_CODE_SIGN_APPLE_ID

    # Apple ID password (recommend generating and using an app-specific password)
    MAC_CODE_SIGN_APPLE_ID_PASSWORD

    # The identity name of the Developer ID Application or Mac App Distribution certificate (i.e.
    # "Developer ID Application: <your_name> (<your_team_id>)")
    MAC_CODE_SIGN_IDENTITY

    # The base-64 encoded string of the .p12 file
    MAC_CODE_SIGN_CERTIFICATE

    # The password provided while exporting the .p12 file
    MAC_CODE_SIGN_CERTIFICATE_PASSWORD
    ```

## Windows

> For more details see https://www.electronjs.org/docs/latest/tutorial/code-signing

Code signing for Windows involves acquiring a code signing certificate from a 3rd party reseller, such as [DigiCert](https://www.digicert.com/).
1. Obtain the certificate file and ensure that it is in `.pfx` format
2. Provide a secure password to unlock the `.pfx` file
3. Encode the `.pfx` file to a base-64 string: `base64 -i certificate.pfx`
4. Provide the following environment variables for later use (i.e. in the CI environment):
    ```sh
    # The base-64 encoded string of the .pfx file
    WIN_CODE_SIGN_CERTIFICATE

    # The password provided while exporting the .pfx file
    WIN_CODE_SIGN_CERTIFICATE_PASSWORD
    ```

## Production Logging

By default, logs are written to the following locations:

- on Linux: `~/.config/{app name}/logs/{process type}.log`
- on OS X: `~/Library/Logs/{app name}/{process type}.log`
- on Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`
