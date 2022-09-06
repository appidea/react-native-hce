package com.reactnativehce.utils;

public class ByteArrayOperations {
  public static byte[] fillByteArrayToFixedDimension(byte[] array, int fixedSize) {
    if (array.length == fixedSize) {
      return array;
    }

    byte[] start = BinaryUtils.HexStringToByteArray("00");
    byte[] filledArray = new byte[start.length + array.length];
    System.arraycopy(start, 0, filledArray, 0, start.length);
    System.arraycopy(array, 0, filledArray, start.length, array.length);
    return fillByteArrayToFixedDimension(filledArray, fixedSize);
  }
}
