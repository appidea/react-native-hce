package com.reactnativehce;

import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.Nullable;
import androidx.lifecycle.Observer;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativehce.services.CardService;

public class HceModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private HceAndroidViewModel model;

  final Observer<String> observer = new Observer<String>() {
    @Override
    public void onChanged(@Nullable final String lastState) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("hceState", lastState);
    }
  };

  HceModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "Hce";
  }

  @ReactMethod
  public void setContent(String type, String content, Promise promise) {
    SharedPreferences.Editor editor = reactContext.getApplicationContext().getSharedPreferences("hce", Context.MODE_PRIVATE)
      .edit();

    editor.putString("type", type);
    editor.putString("content", content);

    editor.apply();

    promise.resolve(null);
  }

  @ReactMethod
  public void setEnabled(Boolean enabled, Promise promise) {
    reactContext.getApplicationContext().getPackageManager()
      .setComponentEnabledSetting(
        new ComponentName(reactContext.getApplicationContext(), CardService.class),
        enabled ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
      );

    if (enabled) {
      this.model = HceAndroidViewModel.getInstance(this.getReactApplicationContext().getApplicationContext());
      new Handler(Looper.getMainLooper())
        .post(() -> this.model.getLastState().observeForever(observer));
    } else {
      new Handler(Looper.getMainLooper())
        .post(() -> this.model.getLastState().removeObserver(observer));
    }

    promise.resolve(enabled);
  }
}
