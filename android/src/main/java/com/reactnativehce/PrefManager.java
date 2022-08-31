package com.reactnativehce;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

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
