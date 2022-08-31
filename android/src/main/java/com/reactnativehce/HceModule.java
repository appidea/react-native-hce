package com.reactnativehce;

import android.content.ComponentName;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.reactnativehce.services.CardService;

import androidx.annotation.NonNull;

public class HceModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private final EventManager listenerFactory;
  private final PrefManager prefManager;

  HceModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
    listenerFactory = EventManager.getInstance(context);
    prefManager = PrefManager.getInstance(context.getApplicationContext());

    if (prefManager.exists()) {
      this.enableHceService(prefManager.getEnabled());
    }
  }

  @NonNull
  @Override
  public String getName() {
    return "Hce";
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void addListener(String eventName) throws Exception {
    if (!eventName.equals(EventManager.EVENT_STATE)) {
      throw new Exception("Event not supported: " + eventName);
    }

    this.listenerFactory.addListener(EventManager.EVENT_STATE);
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void removeListeners(Integer count) {
    this.listenerFactory.clear();
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void setContent(String type, String content, Boolean writable, Promise promise) {
    prefManager.setType(type);
    prefManager.setContent(content);
    prefManager.setWritable(writable);

    promise.resolve(null);
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void getContent(Promise promise) {
    if (!prefManager.exists()) {
      promise.resolve(null);
      return;
    }

    WritableMap wm = Arguments.createMap();
    wm.putString("type", prefManager.getType());
    wm.putString("content", prefManager.getContent());
    wm.putBoolean("writable", prefManager.getWritable());
    wm.putBoolean("enabled", prefManager.getEnabled());

    promise.resolve(wm);
  }

  private void enableHceService(Boolean enabled) {
    reactContext.getApplicationContext().getPackageManager()
      .setComponentEnabledSetting(
        new ComponentName(reactContext.getApplicationContext(), CardService.class),
        enabled ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
      );
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void setEnabled(Boolean enabled, Promise promise) {
    this.prefManager.setEnabled(enabled);
    this.enableHceService(enabled);
    promise.resolve(enabled);
  }
}
