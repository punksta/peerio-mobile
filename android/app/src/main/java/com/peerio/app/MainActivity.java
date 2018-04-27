package com.peerio.app;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.WindowManager;
import android.net.Uri;
import android.content.Intent;
import android.app.Activity;

import com.facebook.react.*;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactActivityDelegate;
import android.support.annotation.Nullable;

public class MainActivity extends ReactActivity {
    protected Uri imageUri = null;
    protected String shareText = null;
    /**
     * Override this to prevent screenshots to be taken
     * @param savedInstanceState
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Intent intent = getIntent();
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type)) {
                handleSendText(intent); // Handle text being sent
            } else if (type.startsWith("image/")) {
                handleSendImage(intent); // Handle single image being sent
            }
        }

        // only enable FLAG_SECURE for release builds
        if (BuildConfig.DEBUG) return;
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE);
    }

    void handleSendText(Intent intent) {
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText != null) {
            this.shareText = sharedText;
            // Update UI to reflect text being shared
        }
    }
    void handleSendImage(Intent intent) {
        Uri imageUri1 = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (imageUri1 != null) {
            this.imageUri = imageUri1;
            // Update UI to reflect image being shared
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        final int REACT_NATIVE_IMAGE_PICKER_PERMISSION = 1;
        final int REACT_NATIVE_CONTACTS_PERMISSION = 2;
        if (grantResults.length > 0) {
            ReactContext context = this.getReactInstanceManager().getCurrentReactContext();
            if (context == null) {
                return;
            }
            String jsCallback = "";
            switch (requestCode) {
                case REACT_NATIVE_IMAGE_PICKER_PERMISSION: jsCallback = "CameraPermissionsGranted"; break;
                case REACT_NATIVE_CONTACTS_PERMISSION: jsCallback = "ContactPermissionsGranted"; break;
            }

            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(jsCallback, grantResults[0] == PackageManager.PERMISSION_GRANTED);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        moveTaskToBack(true);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "peeriomobile";
    }

    public static class TestActivityDelegate extends ReactActivityDelegate {
        private static final String TEST = "test";
        private Bundle mInitialProps = null;
        private final
        @Nullable
        Activity mActivity;
        public TestActivityDelegate(Activity activity, String mainComponentName) {
            super(activity, mainComponentName);
            this.mActivity = activity;
        }
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            Bundle bundle = mActivity.getIntent().getExtras();
            if (bundle != null) {
                mInitialProps = new Bundle();
                mInitialProps.putString(TEST, mActivity.getIntent().getStringExtra(Intent.EXTRA_TEXT));
            }
            super.onCreate(savedInstanceState);
        }
        @Override
        protected Bundle getLaunchOptions() {
            return mInitialProps;
        }
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new TestActivityDelegate(this, getMainComponentName());
    }
}