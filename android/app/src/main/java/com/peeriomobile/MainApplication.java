package com.peeriomobile;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.stetho.Stetho;
import com.zmxv.RNSound.RNSoundPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.fileopener.FileOpenerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  public void onCreate() {
    super.onCreate();
    Stetho.initializeWithDefaults(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new ReactNativePushNotificationPackage(),
            new FileOpenerPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeRestartPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new RandomBytesPackage(),
            new RNFSPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
