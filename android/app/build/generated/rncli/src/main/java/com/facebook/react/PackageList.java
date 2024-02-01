
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-firebase/analytics
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/crashlytics
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-blob-util
import com.ReactNativeBlobUtil.ReactNativeBlobUtilPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-google-analytics-bridge
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
// react-native-image-base64
import fr.snapp.imagebase64.RNImgToBase64Package;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-in-app-review
import com.ibits.react_native_in_app_review.AppReviewPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-pdf
import org.wonday.pdf.RCTPdfView;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-razorpay
import com.razorpay.rn.RazorpayPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-version-info
import cx.evermeet.versioninfo.RNVersionInfoPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new ReactNativeFirebaseAnalyticsPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseCrashlyticsPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new LottiePackage(),
      new ReactNativeBlobUtilPackage(),
      new FastImageViewPackage(),
      new RNGestureHandlerPackage(),
      new GoogleAnalyticsBridgePackage(),
      new RNImgToBase64Package(),
      new ImagePickerPackage(),
      new AppReviewPackage(),
      new LinearGradientPackage(),
      new RCTPdfView(),
      new RNPermissionsPackage(),
      new ReactNativePushNotificationPackage(),
      new RazorpayPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSharePackage(),
      new SplashScreenReactPackage(),
      new VectorIconsPackage(),
      new RNVersionInfoPackage(),
      new ReactVideoPackage(),
      new RNCWebViewPackage()
    ));
  }
}
