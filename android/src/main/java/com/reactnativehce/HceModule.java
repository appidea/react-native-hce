package com.reactnativehce;

import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.reactnativehce.services.CardService;

public class HceModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

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

    promise.resolve(enabled);
  }
}
