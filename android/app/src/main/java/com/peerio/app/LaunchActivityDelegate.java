package com.peerio.app;

import android.os.Bundle;
import android.app.Activity;
import android.net.Uri;
import android.content.Intent;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivityDelegate;

public class LaunchActivityDelegate extends ReactActivityDelegate {
    private final @Nullable Activity mActivity;
    private Bundle mInitialProps = null;

    public LaunchActivityDelegate(Activity activity, String mainComponentName) {
        super(activity, mainComponentName);
        this.mActivity = activity;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Intent intent = mActivity.getIntent();
        if (intent.getExtras() != null) {
            String type = intent.getType();

            mInitialProps = new Bundle();
            if (Intent.ACTION_SEND.equals(intent.getAction()) && type != null) {
                if (type.startsWith("image/")) {
                    handleSendFile(intent);
                }
            }
        }
        super.onCreate(savedInstanceState);
    }

    @Override
    protected Bundle getLaunchOptions() {
        return mInitialProps;
    }

    void handleSendFile(Intent intent) {
        Uri imageUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
        
        if (imageUri != null) {
            mInitialProps = new Bundle();
            mInitialProps.putString("sharedFile", imageUri.toString());
        }
    }
}
