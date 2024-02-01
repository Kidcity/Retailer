// package com.kidcity.krp;

// import android.annotation.SuppressLint;
// import android.content.Context;
// import android.os.Build;

// import com.facebook.react.bridge.Promise;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;

// public class DeviceInfo extends ReactContextBaseJavaModule {
//     private final ReactApplicationContext context;

//     public DeviceInfo(ReactApplicationContext context) {
//         super(context);
//         this.context = context;
//     }

//     @Override
//     public String getName() {
//         return "DeviceInfo";
//     }

//     @ReactMethod
//     public void isAndroid13OrUp(Promise promise) {
//         try{
//             if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
//                 promise.resolve(true);
//             }else{
//                 promise.resolve(false);
//             }
//         }
//             catch (Exception e) {       
//             promise.reject(new Exception("Something went wrong to get the version."));
//         }
//     }
// }

package com.kidcity.krp; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.Promise;
import android.os.Build;

public class DeviceInfoModule extends ReactContextBaseJavaModule {
    DeviceInfoModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceInfoModule";
    }

    @ReactMethod
    public void isAndroid13OrUp( Promise promise) {
        try{
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                promise.resolve(true);
            }else{
                promise.resolve(false);
            }
        }catch (Exception e) {
            promise.resolve(false);
        }
    }
}
