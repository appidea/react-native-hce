package com.reactnativehce.utils;

import com.reactnativehce.utils.BinaryUtils;

import java.util.Arrays;

public class ApduHelper {
  public static final byte[] C_APDU_SELECT_APP = BinaryUtils.HexStringToByteArray("00A40400");
  public static final byte[] C_APDU_SELECT_FILE = BinaryUtils.HexStringToByteArray("00A4000C02");
  public static final byte[] C_APDU_READ = BinaryUtils.HexStringToByteArray("00B0");
  public static final byte[] C_APDU_WRITE = BinaryUtils.HexStringToByteArray("00D6");
  public static final byte[] R_APDU_OK = BinaryUtils.HexStringToByteArray("9000");
  public static final byte[] R_APDU_ERROR = BinaryUtils.HexStringToByteArray("6A82");

  public static Boolean commandByRangeEquals(byte[] command, Integer from, Integer to, byte[] expectedCommand) {
    return Arrays.equals(Arrays.copyOfRange(command, from, to), expectedCommand);
  }
}
