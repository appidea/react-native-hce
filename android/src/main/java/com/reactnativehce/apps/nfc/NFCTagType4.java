package com.reactnativehce.apps.nfc;

import android.util.Log;

import com.reactnativehce.ApduHelper;
import com.reactnativehce.utils.BinaryUtils;
import com.reactnativehce.IHCEApplication;

import java.util.Arrays;

public class NFCTagType4 implements IHCEApplication {
  private static final String TAG = "NFCTag";
  private static final byte[] C_APDU_SELECT = BinaryUtils.HexStringToByteArray("00A4040007D276000085010100");
  private static final byte[] FILENAME_CC = BinaryUtils.HexStringToByteArray("E103");
  private static final byte[] FILENAME_NDEF = BinaryUtils.HexStringToByteArray("E104");
  private static final byte[] CC_HEADER = BinaryUtils.HexStringToByteArray("001120FFFFFFFF");

  private enum SelectedFile {
    FILENAME_CC,
    FILENAME_NDEF
  }

  private final NdefEntity ndefEntity;
  private final Boolean writable;
  private SelectedFile selectedFile = null;

  public NFCTagType4(String type, String content, Boolean isWritable) {
    this.ndefEntity = new NdefEntity(type, content);
    this.writable = isWritable;
  }

  private static byte[] getCCControlTlv(Boolean writable) {
    return BinaryUtils.HexStringToByteArray("0406E104FFFE00" + (writable ? "00":"FF"));
  }

  private byte[] getCapabilityContainerContent() {
    byte[] response = new byte[15];

    System.arraycopy(CC_HEADER, 0, response, 0, CC_HEADER.length);

    byte[] controlTlv = getCCControlTlv(writable);
    System.arraycopy(controlTlv, 0, response, CC_HEADER.length, controlTlv.length);

    return response;
  }

  private byte[] getNdefContent() {
    byte[] fullResponse = new byte[ndefEntity.lengthArray.length + ndefEntity.byteArray.length];
    System.arraycopy(ndefEntity.lengthArray, 0, fullResponse, 0, ndefEntity.lengthArray.length);
    System.arraycopy(ndefEntity.byteArray,0, fullResponse, ndefEntity.lengthArray.length, ndefEntity.byteArray.length);

    return fullResponse;
  }

  private byte[] getFullResponseByFile() {
    switch (selectedFile) {
      case FILENAME_CC:
        return getCapabilityContainerContent();
      case FILENAME_NDEF:
        return getNdefContent();
      default:
        throw new Error("Unknown file");
    }
  }

  public boolean assertSelectCommand(byte[] command) {
    return ApduHelper.commandByRangeEquals(command, 0, 13, C_APDU_SELECT);
  }

  private byte[] respondSelectFile(byte[] command) {
    byte[] file = Arrays.copyOfRange(command, 5, 7);

    if (Arrays.equals(file, FILENAME_CC)) {
      this.selectedFile = SelectedFile.FILENAME_CC;
    } else if (Arrays.equals(file, FILENAME_NDEF)) {
      this.selectedFile = SelectedFile.FILENAME_NDEF;
    }

    if (this.selectedFile != null) {
      return ApduHelper.R_APDU_OK;
    }

    return ApduHelper.R_APDU_ERROR;
  }

  private byte[] respondRead(byte[] command) {
    if (this.selectedFile == null) {
      return ApduHelper.R_APDU_ERROR;
    }

    int offset = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 2, 4)), 16);
    int length = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 4, 5)), 16);

    byte[] fullResponse = getFullResponseByFile();
    byte[] slicedResponse = Arrays.copyOfRange(fullResponse, offset, fullResponse.length);

    int realLength = Math.min(slicedResponse.length, length);
    byte[] response = new byte[realLength + ApduHelper.R_APDU_OK.length];

    System.arraycopy(slicedResponse, 0, response, 0, realLength);
    System.arraycopy(ApduHelper.R_APDU_OK, 0, response, realLength, ApduHelper.R_APDU_OK.length);

    return response;
  }

  public byte[] processCommand(byte[] command) {
    if (ApduHelper.commandByRangeEquals(command, 0, 5, ApduHelper.C_APDU_SELECT_FILE)) {
      return this.respondSelectFile(command);
    }

    if (ApduHelper.commandByRangeEquals(command, 0, 2, ApduHelper.C_APDU_READ)) {
      return this.respondRead(command);
    }

    Log.i(TAG, "Unknown command.");

    return ApduHelper.R_APDU_ERROR;
  }
}
