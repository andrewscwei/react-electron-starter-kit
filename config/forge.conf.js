const path = require('path')

const cwd = path.join(__dirname, '../')

/**
 * Identity of code sign certificate (i.e. `Developer ID Application: <your_name> (<your_id>)`).
 */
const macCodeSignIdentity = process.env.MAC_CODE_SIGN_IDENTITY

/**
 * Apple ID (email) used for notarizing the macOS app.
 */
const macCodeSignAppleId = process.env.MAC_CODE_SIGN_APPLE_ID

/**
 * Apple ID password (recommend generating and using an app-specific password) for notarizing the
 * macOS app.
 */
const macCodeSignAppleIdPassword = process.env.MAC_CODE_SIGN_APPLE_ID_PASSWORD

/**
 * Absolute path to the Windows code sign certificate file (.pfx).
 */
const winCodeSignCertificateFile = process.env.WIN_CODE_SIGN_CERTIFICATE_FILE

/**
 * Password to unlock the Windows code sign certificate file.
 */
const winCodeSignCertificatePassword = process.env.WIN_CODE_SIGN_CERTIFICATE_PASSWORD

const shouldCodeSignMac = macCodeSignIdentity && macCodeSignAppleId && macCodeSignAppleIdPassword

const shouldCodeSignWin = winCodeSignCertificateFile && winCodeSignCertificatePassword

module.exports = {
  'packagerConfig': {
    'appBundleId': 'mu.andr.reactelectronstarterkit',
    'dir': 'build',
    'icon': path.join(cwd, 'res/icons/icon'),
    'name': 'React Electron Starter Kit',
    ...shouldCodeSignMac ? {
      'osxSign': {
        'identity': macCodeSignIdentity,
        'hardened-runtime': true,
        'entitlements': path.join(cwd, 'res/entitlements.plist'),
        'entitlements-inherit': path.join(cwd, 'res/entitlements.plist'),
        'signature-flags': 'library',
      },
      'osxNotarize': {
        'appleId': macCodeSignAppleId,
        'appleIdPassword': macCodeSignAppleIdPassword,
      },
    } : {},
  },
  'makers': [{
    'name': '@electron-forge/maker-zip',
    'platforms': ['darwin', 'linux'],
    'config': {}
  }, {
    'name': '@electron-forge/maker-squirrel',
    'platforms': ['win32'],
    'config': {
      ...shouldCodeSignWin ? {
        'certificateFile': winCodeSignCertificateFile,
        'certificatePassword': winCodeSignCertificatePassword,
      } : {},
    }
  }],
  'publishers': [{
    'name': '@electron-forge/publisher-github',
    'config': {
      'draft': true,
      'prerelease': false,
      'repository': {
        'name': 'react-electron-starter-kit',
        'owner': 'andrewscwei'
      }
    }
  }]
}
