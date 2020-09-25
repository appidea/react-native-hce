package com.reactnativehce.apps.nfc;

import android.util.Log;

import com.reactnativehce.utils.BinaryUtils;
import com.reactnativehce.apps.HCEApplication;

import java.util.Arrays;

public class NFCTag implements HCEApplication {
  private static final String TAG = "NFCTag";

  private static final byte[] CMD_CAPABILITY_CONTAINER_OK = BinaryUtils.HexStringToByteArray("00A4000C02E103");
  private static final byte[] CMD_READ_CAPABILITY_CONTAINER = BinaryUtils.HexStringToByteArray("00B000000F");
  private static final byte[] CMD_READ_CAPABILITY_CONTAINER_RESPONSE = BinaryUtils.HexStringToByteArray("001120FFFFFFFF0406E104FFFE00FF9000");
  private static final byte[] CMD_NDEF_SELECT_OK = BinaryUtils.HexStringToByteArray("00A4000C02E104");
  private static final byte[] CMD_NDEF_READ_BINARY_NLEN = BinaryUtils.HexStringToByteArray("00B0000002");
  private static final byte[] CMD_NDEF_READ_BINARY = BinaryUtils.HexStringToByteArray("00B0");
  private static final byte[] CMD_OK = BinaryUtils.HexStringToByteArray("9000");
  private static final byte[] CMD_ERROR = BinaryUtils.HexStringToByteArray("6A82");

  private NdefEntity ndefEntity;

  public NFCTag(String type, String content) {
    ndefEntity = new NdefEntity(type, content);
  }

  private boolean READ_CAPABILITY_CONTAINER_CHECK = false;

  public boolean assertSelectCommand(byte[] command) {
    byte[] selectCommand = BinaryUtils.HexStringToByteArray("00A4040007D276000085010100");
    return Arrays.equals(command, selectCommand);
  }

  public byte[] processCommand(byte[] command) {
    if (Arrays.equals(CMD_CAPABILITY_CONTAINER_OK, command)) {
      Log.i(TAG, "Requesting CAPABILITY");
      return CMD_OK;
    }

    if (Arrays.equals(CMD_READ_CAPABILITY_CONTAINER, command) && !READ_CAPABILITY_CONTAINER_CHECK) {
      Log.i(TAG, "Requesting CAPABILITY CONTAINER");
      READ_CAPABILITY_CONTAINER_CHECK = true;
      return CMD_READ_CAPABILITY_CONTAINER_RESPONSE;
    }

    if (Arrays.equals(CMD_NDEF_SELECT_OK, command)) {
      Log.i(TAG, "Confirming CMD_NDEF_SELECT");
      return CMD_OK;
    }

    if (Arrays.equals(CMD_NDEF_READ_BINARY_NLEN, command)) {
      Log.i(TAG, "Requesting CMD_NDEF_READ_BINARY_NLEN");

      byte[] response = new byte[ndefEntity.lengthArray.length + CMD_OK.length];
      System.arraycopy(ndefEntity.lengthArray, 0, response, 0, ndefEntity.lengthArray.length);
      System.arraycopy(CMD_OK, 0, response, ndefEntity.lengthArray.length, CMD_OK.length);

      READ_CAPABILITY_CONTAINER_CHECK = false;
      return response;
    }

    if (Arrays.equals(Arrays.copyOfRange(command, 0, 2), CMD_NDEF_READ_BINARY)) {
      Log.i(TAG, "Requesting NDEF Content");

      int offset = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 2, 4)), 16);
      int length = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 4, 5)), 16);

      byte[] fullResponse = new byte[ndefEntity.lengthArray.length + ndefEntity.byteArray.length];
      System.arraycopy(ndefEntity.lengthArray, 0, fullResponse, 0, ndefEntity.lengthArray.length);
      System.arraycopy(ndefEntity.byteArray,0, fullResponse, ndefEntity.lengthArray.length, ndefEntity.byteArray.length);

      byte[] slicedResponse = Arrays.copyOfRange(fullResponse, offset, fullResponse.length);

      int realLength = (slicedResponse.length <= length) ? slicedResponse.length : length;
      byte[] response = new byte[realLength + CMD_OK.length];

      System.arraycopy(slicedResponse, 0, response, 0, realLength);
      System.arraycopy(CMD_OK, 0, response, realLength, CMD_OK.length);

      READ_CAPABILITY_CONTAINER_CHECK = false;
      return response;
    }

    Log.i(TAG, "Unknown command.");

    return CMD_ERROR;
  }
}
