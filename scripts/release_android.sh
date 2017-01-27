#!/bin/sh
# stop execution on error
set -e

function signapk(){
  echo ==========================================================
  echo "SIGNING: $1 => $2"
  echo ==========================================================
  jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore peerio.keystore $1 peerio_release_key

  echo ========== VERIFYING ==========
  jarsigner -verify -verbose -certs $1

  echo ========== ZIPALIGN ==========
  zipalign -f -v 4 $1 $2
}

DATE=`date +%Y-%m-%d`
signapk ./android/app/build/outputs/apk/app-release-unsigned.apk ./android/app/build/outputs/apk/app-release-signed.apk

echo ============================================
echo "||             BUILD SUCCESS              ||"
echo ============================================
