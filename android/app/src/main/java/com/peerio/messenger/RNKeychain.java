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
import android.security.KeyPairGeneratorSpec;
import android.util.Log;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Signature;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.util.Calendar;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.security.auth.x500.X500Principal;

import android.util.Base64;

import static android.content.ContentValues.TAG;

public class RNKeychain extends ReactContextBaseJavaModule {
    private static final String B64SEPARATOR = ",";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String ALIAS_AES = "peerio-mobile-android-key";
    private static final String ALIAS_RSA = "peerio-mobile-android-key-rsa";
    private static final String RSA_SIGN_CONSTANT = "Peerio Mobile Keystore";
    private KeyStore _keyStore;
    public RNKeychain(final ReactApplicationContext reactContext) {
        super(reactContext);
        try {
            _keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            _keyStore.load(null);

            int nBefore = _keyStore.size();

            // Create the keys if necessary
            if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                // On Android 5, generate RSA key pair.
                // We'll use private key from it for deriving AES-GCM key.
                if (!_keyStore.containsAlias(ALIAS_RSA)) {
                    Calendar start = Calendar.getInstance();
                    Calendar end = Calendar.getInstance();
                    end.add(Calendar.YEAR, 100);
                    KeyPairGeneratorSpec spec = new KeyPairGeneratorSpec.Builder(this.getReactApplicationContext())
                            .setAlias(ALIAS_RSA)
                            .setSubject(new X500Principal("CN=Mobile KeyStore, O=Peerio Mobile KeyStore"))
                            .setSerialNumber(BigInteger.ONE)
                            .setKeySize(2048)
                            .setStartDate(start.getTime())
                            .setEndDate(end.getTime())
                            .build();

                    final KeyPairGenerator keyPairGenerator = KeyPairGenerator
                            .getInstance("RSA", ANDROID_KEY_STORE);

                    keyPairGenerator.initialize(spec);
                    keyPairGenerator.generateKeyPair();
                }
            } else {
                // On Android 6 and later, generate AES-GCM key.
                if (!_keyStore.containsAlias(ALIAS_AES)) {
                    final KeyGenerator keyGenerator = KeyGenerator
                            .getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);

                    final KeyGenParameterSpec keyGenParameterSpec = new KeyGenParameterSpec.Builder(ALIAS_AES,
                            KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                            .build();
                    keyGenerator.init(keyGenParameterSpec);
                    keyGenerator.generateKey();
                }
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
        try {
            SecretKey secretKey = null;
            if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                // On Android 5 calculate AES-GCM key by getting an RSA key pair
                // from KeyStore and deterministically (without padding) signing
                // a constant string with it, then calculating a hash of the signature.
                final KeyStore.PrivateKeyEntry privateKeyEntry =
                        (KeyStore.PrivateKeyEntry) _keyStore.getEntry(ALIAS_RSA, null);
                final RSAPrivateKey privateKey = (RSAPrivateKey) privateKeyEntry.getPrivateKey();

                // Calculate signature of RSA_SIGN_CONSTANT.
                Signature sig = Signature.getInstance("NONEwithRSA");
                sig.initSign(privateKey);
                sig.update(RSA_SIGN_CONSTANT.getBytes("UTF-8"));
                byte[] signature = sig.sign();

                // Hash signature.
                MessageDigest md= MessageDigest.getInstance("SHA-256");
                md.update(signature);
                byte[] keyBytes = md.digest();

                secretKey = new SecretKeySpec(keyBytes, "AES");
            } else {
                // On Android 6> get AES-GCM key directly from KeyStore.
                final KeyStore.SecretKeyEntry secretKeyEntry =
                        (KeyStore.SecretKeyEntry) _keyStore.getEntry(ALIAS_AES, null);
                secretKey = secretKeyEntry.getSecretKey();
            }

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
            // Won't be thrown when using GCM.
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (InvalidAlgorithmParameterException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (UnsupportedEncodingException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (KeyStoreException e) {
            Log.e(TAG, Log.getStackTraceString(e));
        } catch (SignatureException e) {
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
