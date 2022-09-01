/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

package com.reactnativehce.managers;

import android.content.Context;
import android.content.SharedPreferences;

public class PrefManager {
  private static PrefManager instance = null;
  private final static String PREF_LIB_SUFFIX = ".HCE_DATA";
  private final SharedPreferences preferences;

  public PrefManager(Context applicationContext) {
    this.preferences = applicationContext.getSharedPreferences(
      applicationContext.getPackageName() + PREF_LIB_SUFFIX,
      Context.MODE_PRIVATE
    );
  }

  public static PrefManager getInstance(Context applicationContext) {
    if (instance == null) {
      instance = new PrefManager(applicationContext);
    }

    return instance;
  }

  public Boolean exists() {
    return preferences.contains("type");
  }

  public void setContent(String text) {
    preferences.edit().putString("content", text).apply();
  }

  public String getContent() {
    return preferences.getString("content", "");
  }

  public void setType(String text) {
    preferences.edit().putString("type", text).apply();
  }

  public String getType() {
    return preferences.getString("type", "");
  }

  public void setWritable(Boolean writable) {
    preferences.edit().putBoolean("writable", writable).apply();
  }

  public Boolean getWritable() {
    return preferences.getBoolean("writable", false);
  }

  public void setEnabled(Boolean enabled) {
    preferences.edit().putBoolean("enabled", enabled).apply();
  }

  public Boolean getEnabled() {
    return preferences.getBoolean("enabled", false);
  }
}
