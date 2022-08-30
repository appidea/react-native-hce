package com.reactnativehce.apps.nfc;

import android.nfc.NdefRecord;
import android.util.Log;
import java.math.BigInteger;
import java.nio.charset.Charset;
import com.reactnativehce.utils.BinaryUtils;

public class NdefEntity {
  public byte[] byteArray;
  public byte[] lengthArray;

  public static String TAG = "NdefEntity";

  public NdefEntity(String type, String content) {
    NdefRecord record;

    if (type.equals("text")) {
      record = NdefRecord.createTextRecord("en", content);
    } else if (type.equals("url")) {
      record = NdefRecord.createUri(content);
    } else {
      throw new IllegalArgumentException("Wrong NFC tag content type");
    }

    byteArray = record.toByteArray();
    lengthArray = fillByteArrayToFixedDimension(
      BigInteger.valueOf(Long.valueOf(byteArray.length)).toByteArray(),
      2
    );
  }

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
