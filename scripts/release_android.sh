#!/bin/sh
# stop execution on error
set -e

function signapk(){
  echo ==========================================================
  echo "SIGNING: $1 => $2"
  echo ==========================================================
  jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore peerio.keystore -storepass:file peerio.keystorepass $1 peerio_release_key

  echo ========== VERIFYING ==========
  jarsigner -verify -verbose -certs $1

  echo ========== ZIPALIGN ==========
  zipalign -f -v 4 $1 $2
}

DATE=`date +%Y-%m-%d`

signapk ./android/app/build/outputs/apk/app-armeabi-v7a-release-unsigned.apk ./android/app/build/outputs/apk/app-armeabi-v7a-release-signed.apk
signapk ./android/app/build/outputs/apk/app-x86-release-unsigned.apk ./android/app/build/outputs/apk/app-x86-release-signed.apk

zip -d ./android/app/build/outputs/apk/app-armeabi-v7a-debug.apk 'META-INF/*.SF' 'META-INF/*.RSA'
zip -d ./android/app/build/outputs/apk/app-x86-debug-unaligned.apk 'META-INF/*.SF' 'META-INF/*.RSA'
signapk ./android/app/build/outputs/apk/app-armeabi-v7a-debug.apk ./android/app/build/outputs/apk/app-armeabi-v7a-debug-signed.apk
signapk ./android/app/build/outputs/apk/app-x86-debug-unaligned.apk ./android/app/build/outputs/apk/app-x86-debug-signed.apk

echo ============================================
echo "||             BUILD SUCCESS              ||"
echo ============================================
