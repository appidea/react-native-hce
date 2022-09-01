package com.reactnativehce;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.reactnativehce.managers.EventManager;
import com.reactnativehce.managers.PrefManager;
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
  public void setContent(ReadableMap properties, Promise promise) {
    Log.i("IHCE", properties.getString("type"));
    prefManager.setType(properties.getString("type"));
    prefManager.setContent(properties.getString("content"));
    prefManager.setWritable(properties.getBoolean("writable"));

    promise.resolve(null);
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void getContent(Promise promise) {
    if (!prefManager.exists()) {
      promise.resolve(null);
      return;
    }

    WritableMap properties = Arguments.createMap();
    properties.putString("type", prefManager.getType());
    properties.putString("content", prefManager.getContent());
    properties.putBoolean("writable", prefManager.getWritable());

    promise.resolve(properties);
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
  public void getEnabled(Promise promise) {
    promise.resolve(prefManager.getEnabled());
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void setEnabled(Boolean enabled, Promise promise) {
    this.prefManager.setEnabled(enabled);
    this.enableHceService(enabled);
    promise.resolve(enabled);
  }
}
