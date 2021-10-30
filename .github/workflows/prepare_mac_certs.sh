#!/usr/bin/env sh

KEYCHAIN=build.keychain
CERTIFICATE=certificate.p12

# Prepare .p12 file.
echo $CERTIFICATE_ENCODED | base64 --decode > $CERTIFICATE

# Prepare keychain.
security create-keychain -p actions $KEYCHAIN
security default-keychain -s $KEYCHAIN
security unlock-keychain -p actions $KEYCHAIN

# Import .p12 file to keychain.
security import $CERTIFICATE -k $KEYCHAIN -P $CERTIFICATE_PASSWORD -T /usr/bin/codesign;
security set-key-partition-list -S apple-tool:,apple: -s -k actions $KEYCHAIN

# Remove create .p12 file.
rm -fr *.p12
