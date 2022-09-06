/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

package com.reactnativehce.managers;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.lifecycle.Observer;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashSet;

public class EventManager {
  public static final String TAG = "EventManager";
  private static EventManager instance = null;
  private final HashSet<String> observedEvents;
  private ReactApplicationContext context;
  private HceViewModel model;

  public final static String EVENT_STATE = "hceState";

  final Observer<String> observer = new Observer<String>() {
    @Override
    public void onChanged(@Nullable final String lastState) {
      try {
        context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(EVENT_STATE, lastState);
      } catch (Exception e) {
        Log.w(TAG, "There was a problem when attempting to send event to RN bridge: " + e.getMessage());
      }
    }
  };

  public EventManager() {
    observedEvents = new HashSet<>();
  }

  public void setContext(ReactApplicationContext context) {
    this.context = context;
  }

  public static EventManager getInstance(ReactApplicationContext c) {
    if (instance == null) {
      instance = new EventManager();
    }

    instance.setContext(c);

    return instance;
  }

  public void addListener(String eventName) {
    if (observedEvents.contains(eventName)) {
      return;
    }

    observedEvents.add(eventName);

    if (this.model == null) {
      this.model = HceViewModel.getInstance(context.getApplicationContext());
    }

    new Handler(Looper.getMainLooper())
      .post(() -> this.model.getLastState().observeForever(observer));
  }

  public void clear() {
    observedEvents.clear();

    if (this.model == null) {
      return;
    }

    new Handler(Looper.getMainLooper())
      .post(() -> this.model.getLastState().removeObserver(observer));
  }

}
