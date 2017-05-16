package com.peerio.messenger;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.ShortBufferException;
import javax.crypto.spec.GCMParameterSpec;

import android.util.Base64;

import static android.content.ContentValues.TAG;

public class RNKeychain extends ReactContextBaseJavaModule {
    private static final String B64SEPARATOR = ",";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String ALIAS = "peerio-mobile-android-key";
    private KeyStore _keyStore;
    public RNKeychain(final ReactApplicationContext reactContext) {
        super(reactContext);
        // TODO: WARNING: CURRENTLY ONLY PROVIDES ENCRYPTION TO ANDROID 6.0 AND HIGHER
        if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;
        try {
            _keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            _keyStore.load(null);

            int nBefore = _keyStore.size();

            // Create the keys if necessary
            if (!_keyStore.containsAlias(ALIAS)) {
                final KeyGenerator keyGenerator = KeyGenerator
                        .getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);

                final KeyGenParameterSpec keyGenParameterSpec = new KeyGenParameterSpec.Builder(ALIAS,
                        KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .build();
                keyGenerator.init(keyGenParameterSpec);
                keyGenerator.generateKey();
            }
            int nAfter = _keyStore.size();
            Log.v(TAG, "Before = " + nBefore + " After = " + nAfter);
            String result = serialize(serialize("Encoding/decoding test data", false), true);
            Log.v(TAG, result);
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (NoSuchProviderException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (InvalidAlgorithmParameterException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (KeyStoreException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (CertificateException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (IOException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (UnsupportedOperationException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        }
    }

    @Override
    public String getName() {
        return "RNKeychain";
    }

    private String serialize(String data, boolean decode) {
        // TODO: WARNING: CURRENTLY ONLY PROVIDES ENCRYPTION TO ANDROID 6.0 AND HIGHER
        if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return data;
        try {
            final KeyStore.SecretKeyEntry secretKeyEntry =
                    (KeyStore.SecretKeyEntry)_keyStore.getEntry(ALIAS, null);
            final SecretKey secretKey = secretKeyEntry.getSecretKey();
            Log.v(TAG, secretKey.toString());
            String result = null;
            if (decode) {
                String[] items = data.split(B64SEPARATOR);
                byte[] iv = Base64.decode(items[0], Base64.DEFAULT);
                final GCMParameterSpec spec = new GCMParameterSpec(128, iv);
                final Cipher decipher = Cipher.getInstance(TRANSFORMATION);
                decipher.init(Cipher.DECRYPT_MODE, secretKey, spec);
                byte[] encodedData = Base64.decode(items[1], Base64.DEFAULT);
                result = new String(decipher.doFinal(encodedData), "UTF-8");
            } else {
                final Cipher encipher = Cipher.getInstance(TRANSFORMATION);
                encipher.init(Cipher.ENCRYPT_MODE, secretKey);
                byte[] iv = encipher.getIV();
                byte[] dataToEncode = data.getBytes("UTF-8");
                byte[] intermediate = encipher.doFinal(dataToEncode);
                result = Base64.encodeToString(iv, Base64.DEFAULT)
                    + B64SEPARATOR + Base64.encodeToString(intermediate, Base64.DEFAULT);
                Log.v(TAG, result);
            }
            return result;
        } catch (UnrecoverableEntryException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (UnsupportedOperationException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (NoSuchPaddingException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (InvalidKeyException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (IllegalBlockSizeException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (BadPaddingException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (InvalidAlgorithmParameterException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (UnsupportedEncodingException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (KeyStoreException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        }
        return null;
    }

    private SharedPreferences getPreferences() {
        return getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
    }

    private void saveToPrefs(String key, String value) {
        SharedPreferences.Editor editor = getPreferences().edit();
        editor.putString(key, value);
        editor.commit();
    }

    private void deleteFromPrefs(String key) {
        SharedPreferences.Editor editor = getPreferences().edit();
        editor.remove(key);
        editor.commit();
    }

    private String getFromPrefs(String key) {
        return getPreferences().getString(key, null);
    }

    @ReactMethod
    public void isFeatureAvailable(
            final Promise promise
    ) {
        promise.resolve(false);
    }

    @ReactMethod
    public void saveValue(
            final String value,
            final String key,
            final boolean secureWithTouchID,
            final Promise promise
    ) {
        String encoded = serialize(value, false);
        if (encoded == null) {
            promise.reject("RNKeyChain cipher error", "RNKeyChain cipher error");
        }
        saveToPrefs(key, encoded);
        promise.resolve(true);
    }

    @ReactMethod
    public void getValue(
            final String key,
            final Promise promise
    ) {
        String encoded = getFromPrefs(key);
        if (encoded != null) {
            encoded = serialize(encoded, true);
        }
        promise.resolve(encoded);
    }

    @ReactMethod
    public void deleteValue(
            final String key,
            final Promise promise
    ) {
        deleteFromPrefs(key);
        promise.resolve(true);
    }
}
