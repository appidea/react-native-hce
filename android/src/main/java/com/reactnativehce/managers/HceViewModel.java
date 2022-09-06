/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

package com.reactnativehce.managers;

import android.app.Application;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModelProvider;

public class HceViewModel extends AndroidViewModel {
  private MutableLiveData<String> lastState;
  private static HceViewModel instance = null;

  public static String HCE_STATE_CONNECTED = "connected";
  public static String HCE_STATE_DISCONNECTED = "disconnected";
  public static String HCE_STATE_ENABLED = "enabled";
  public static String HCE_STATE_DISABLED = "disabled";
  public static String HCE_STATE_READ = "read";
  public static String HCE_STATE_WRITE_FULL = "writeFull";
  public static String HCE_STATE_WRITE_PARTIAL = "writePartial";
  public static String HCE_STATE_UPDATE_APPLICATION = "updateApplication";

  public HceViewModel(@NonNull Application application) {
    super(application);
  }

  public static HceViewModel getInstance(Context appContext) {
    if (instance == null) {
      instance = ViewModelProvider.AndroidViewModelFactory.getInstance(
        (Application) appContext
      ).create(HceViewModel.class);
    }

    return instance;
  }

  public MutableLiveData<String> getLastState() {
    if (lastState == null) {
      lastState = new MutableLiveData<>();
    }

    return lastState;
  }
}
