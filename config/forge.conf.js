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

module.exports = {
  'packagerConfig': {
    'dir': 'build',
    'icon': path.join(cwd, 'res/icons/icon'),
    'name': 'React Electron Starter Kit',
    ...(macCodeSignIdentity && macCodeSignAppleId && macCodeSignAppleIdPassword) ? {
      'osxSign': {
        'identity': macCodeSignIdentity,
        'hardened-runtime': true,
        'gatekeeper-assess': false,
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
    'config': {}
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
