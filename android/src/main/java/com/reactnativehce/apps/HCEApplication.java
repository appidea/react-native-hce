package com.reactnativehce.apps;

public interface HCEApplication {
  byte[] processCommand(byte[] command);
  boolean assertSelectCommand(byte[] command);
}
