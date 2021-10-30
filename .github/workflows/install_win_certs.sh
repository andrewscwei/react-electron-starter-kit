#!/usr/bin/env sh

CERTIFICATE=${PWD}/certificate.pfx

# Prepare .p12 file.
echo $CERTIFICATE_ENCODED | base64 --decode > $CERTIFICATE
echo "::set-output name=certificate-file::$(echo $CERTIFICATE)"
