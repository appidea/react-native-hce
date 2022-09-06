/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

package com.reactnativehce;

import android.content.ComponentName;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.reactnativehce.managers.EventManager;
import com.reactnativehce.managers.HceViewModel;
import com.reactnativehce.managers.PrefManager;
import com.reactnativehce.services.CardService;

import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.Map;

public class HceModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private final EventManager eventManager;
  private final PrefManager prefManager;
  private final HceViewModel hceModel;

  HceModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
    eventManager = EventManager.getInstance(context);
    prefManager = PrefManager.getInstance(context.getApplicationContext());
    hceModel = HceViewModel.getInstance(context.getApplicationContext());

    if (prefManager.exists()) {
      this.enableHceService(prefManager.getEnabled());
    }
  }

  @NonNull
  @Override
  public String getName() {
    return "Hce";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("HCE_STATE_CONNECTED", HceViewModel.HCE_STATE_CONNECTED);
    constants.put("HCE_STATE_DISCONNECTED", HceViewModel.HCE_STATE_DISCONNECTED);
    constants.put("HCE_STATE_ENABLED", HceViewModel.HCE_STATE_ENABLED);
    constants.put("HCE_STATE_DISABLED", HceViewModel.HCE_STATE_DISABLED);
    constants.put("HCE_STATE_READ", HceViewModel.HCE_STATE_READ);
    constants.put("HCE_STATE_WRITE_FULL", HceViewModel.HCE_STATE_WRITE_FULL);
    constants.put("HCE_STATE_WRITE_PARTIAL", HceViewModel.HCE_STATE_WRITE_PARTIAL);
    constants.put("HCE_STATE_UPDATE_APPLICATION", HceViewModel.HCE_STATE_UPDATE_APPLICATION);
    return constants;
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void addListener(String eventName) throws Exception {
    if (!eventName.equals(EventManager.EVENT_STATE)) {
      throw new Exception("Event not supported: " + eventName);
    }

    this.eventManager.addListener(EventManager.EVENT_STATE);
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void removeListeners(Integer count) {
    this.eventManager.clear();
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void setContent(ReadableMap properties, Promise promise) {
    prefManager.setType(properties.getString("type"));
    prefManager.setContent(properties.getString("content"));
    prefManager.setWritable(properties.getBoolean("writable"));
    this.hceModel.getLastState()
      .postValue(HceViewModel.HCE_STATE_UPDATE_APPLICATION);

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

    this.hceModel.getLastState()
      .postValue(enabled ? HceViewModel.HCE_STATE_ENABLED : HceViewModel.HCE_STATE_DISABLED);
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
