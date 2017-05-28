package com.peerio.messenger;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import android.util.Base64;

import org.libsodium.jni.Sodium;

import java.io.Console;

import static org.libsodium.jni.NaCl.sodium;

/* import static org.libsodium.jni.SodiumJNI.crypto_pwhash_scryptsalsa208sha256_ll;
import static org.libsodium.jni.SodiumJNI.sodium_init; */

public class RNSodium extends ReactContextBaseJavaModule {

    public RNSodium(final ReactApplicationContext reactContext) {
        super(reactContext);
        this._sodium = sodium();
    }

    Sodium _sodium = null;

    @Override
    public String getName() {
        return "RNSodium";
    }

    @ReactMethod
    public void scrypt(
            final String passwordB64,
            final String saltB64,
            final int N,
            final int r,
            final int p,
            final int dkLen,
            final Promise promise
    ) {
        byte[] password = Base64.decode(passwordB64, Base64.DEFAULT);
        byte[] salt = Base64.decode(saltB64, Base64.DEFAULT);
        byte[] buffer = new byte[dkLen];
        int result = _sodium.crypto_pwhash_scryptsalsa208sha256_ll(
                password,
                password.length,
                salt,
                salt.length,
                N,
                r,
                p,
                buffer,
                buffer.length
        );

        if (result == 0) {
            String resultB64 = Base64.encodeToString(buffer, Base64.DEFAULT);
            promise.resolve(resultB64);
        } else {
            promise.reject("RNSodium.java: scrypt error", "RNSodium.java: scrypt error");
        }
    }

    @ReactMethod
    public void signDetached(
            final String messageB64,
            final String secretKeyB64,
            final Promise promise
    ) {
        byte[] message = Base64.decode(messageB64, Base64.DEFAULT);
        byte[] secretKey = Base64.decode(secretKeyB64, Base64.DEFAULT);
        final int signLength = 64;
        byte[] buffer = new byte[signLength];
        int[] bufferLength = new int[1];
        bufferLength[0] = signLength;
        int result = _sodium.crypto_sign_detached(
                buffer,
                bufferLength,
                message,
                message.length,
                secretKey
        );

        if (result == 0) {
            String resultB64 = Base64.encodeToString(buffer, Base64.DEFAULT);
            promise.resolve(resultB64);
        } else {
            promise.reject("RNSodium.java: sign_detached error", "RNSodium.java: sign_detached error");
        }
    }

    @ReactMethod
    public void verifyDetached(
            final String messageB64,
            final String signatureB64,
            final String publicKeyB64,
            final Promise promise
    ) {
        byte[] message = Base64.decode(messageB64, Base64.DEFAULT);
        byte[] signature = Base64.decode(signatureB64, Base64.DEFAULT);
        byte[] publicKey = Base64.decode(publicKeyB64, Base64.DEFAULT);
        int result = _sodium.crypto_sign_verify_detached(
                signature,
                message,
                message.length,
                publicKey
        );

        if (result == 0) {
            promise.resolve(true);
        } else {
            promise.reject("RNSodium.java: verify_detached error", "RNSodium.java: verify_detached error");
        }
    }
}
