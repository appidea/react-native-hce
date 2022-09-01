/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

package com.reactnativehce;

import android.app.Application;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModelProvider;

public class HceAndroidViewModel extends AndroidViewModel {
  private MutableLiveData<String> lastState;
  private static HceAndroidViewModel instance = null;

  public HceAndroidViewModel(@NonNull Application application) {
    super(application);
  }

  public static HceAndroidViewModel getInstance(Context appContext) {
    if (instance == null) {
      instance = ViewModelProvider.AndroidViewModelFactory.getInstance(
        (Application) appContext
      ).create(HceAndroidViewModel.class);
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
