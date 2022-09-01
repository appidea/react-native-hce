package com.reactnativehce;

public interface IHCEApplication {
  byte[] processCommand(byte[] command);
  boolean assertSelectCommand(byte[] command);
  void onDestroy(int reason);
}
