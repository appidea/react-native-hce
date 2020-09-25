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
      record = createTextRecord("en", content);
    } else if (type.equals("url")) {
      record = createUrlRecord(content);
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

  public static NdefRecord createTextRecord(String language, String text) {
    byte[] languageBytes;
    byte[] textBytes;

    languageBytes = language.getBytes(Charset.forName("US-ASCII"));
    textBytes = text.getBytes(Charset.forName("UTF-8"));

    byte[] recordPayload = new byte[1 + (languageBytes.length & 0x03F) + textBytes.length];

    Integer zeroVal = languageBytes.length & 0x03F;
    recordPayload[0] = zeroVal.byteValue();

    System.arraycopy(languageBytes, 0, recordPayload, 1, languageBytes.length & 0x03F);
    System.arraycopy(textBytes, 0, recordPayload,1 + (languageBytes.length & 0x03F), textBytes.length);

    Log.i(TAG, BinaryUtils.ByteArrayToHexString(recordPayload));

    return new NdefRecord(NdefRecord.TNF_WELL_KNOWN, NdefRecord.RTD_TEXT, null, recordPayload);
  }

  public static NdefRecord createUrlRecord(String text) {
    byte[] textBytes;

    textBytes = text.getBytes(Charset.forName("UTF-8"));

    byte[] recordPayload = new byte[1 + textBytes.length];

    System.arraycopy(textBytes,0, recordPayload,1, textBytes.length);

    Log.i(TAG, BinaryUtils.ByteArrayToHexString(recordPayload));

    return new NdefRecord(NdefRecord.TNF_WELL_KNOWN, NdefRecord.RTD_URI, null, recordPayload);
  }
}
