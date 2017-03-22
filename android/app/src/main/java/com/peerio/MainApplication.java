package com.peerio;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import cl.json.RNSharePackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.fileopener.FileOpenerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.pgsqlite.SQLitePluginPackage;
// import com.facebook.stetho.Stetho;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  public void onCreate() {
    super.onCreate();
    // Stetho.initializeWithDefaults(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
              new InAppBillingBridgePackage(),
          new VectorIconsPackage(),
          new RNSoundPackage(),
          new ReactNativeRestartPackage(),
          new RandomBytesPackage(),
          new ReactNativePushNotificationPackage(),
          new ImagePickerPackage(),
          new FileOpenerPackage(),
          new RNDeviceInfo(),
          new RNFetchBlobPackage(),
          new RNSharePackage(),
          new SQLitePluginPackage(),
          new RNFSPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
