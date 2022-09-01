package com.reactnativehce.apps.nfc;

import android.util.Log;

import com.reactnativehce.utils.ApduHelper;
import com.reactnativehce.HceAndroidViewModel;
import com.reactnativehce.managers.PrefManager;
import com.reactnativehce.utils.BinaryUtils;
import com.reactnativehce.IHCEApplication;

import java.util.Arrays;

public class NFCTagType4 implements IHCEApplication {
  private static final String TAG = "NFCTag";
  private static final byte[] C_APDU_SELECT = BinaryUtils.HexStringToByteArray("00A4040007D276000085010100");
  private static final byte[] FILENAME_CC = BinaryUtils.HexStringToByteArray("E103");
  private static final byte[] FILENAME_NDEF = BinaryUtils.HexStringToByteArray("E104");
  private static final byte[] CC_HEADER = BinaryUtils.HexStringToByteArray("001120FFFFFFFF");
  private final PrefManager prefManager;
  private final HceAndroidViewModel hceModel;

  private SelectedFile selectedFile = null;
  public final byte[] ndefDataBuffer = new byte[0xFFFE];
  public final byte[] ccDataBuffer = new byte[15];

  private enum SelectedFile {
    FILENAME_CC,
    FILENAME_NDEF
  }

  public NFCTagType4(PrefManager prefManager, HceAndroidViewModel model) {
    this.prefManager = prefManager;
    this.hceModel = model;

    this.setUpNdefContent();
    this.setUpCapabilityContainerContent();
  }

  private void setUpNdefContent() {
    byte[] ndef = (new NdefEntity(prefManager.getType(), prefManager.getContent())).getNdefContent();
    System.arraycopy(ndef,0, this.ndefDataBuffer,0,ndef.length );
  }

  private void setUpCapabilityContainerContent() {
    System.arraycopy(CC_HEADER, 0, this.ccDataBuffer, 0, CC_HEADER.length);
    byte[] controlTlv = BinaryUtils.HexStringToByteArray("0406E104FFFE00" + (prefManager.getWritable() ? "00":"FF"));
    System.arraycopy(controlTlv, 0, this.ccDataBuffer, CC_HEADER.length, controlTlv.length);
  }

  private byte[] getFullResponseByFile() {
    switch (selectedFile) {
      case FILENAME_CC:
        return this.ccDataBuffer;
      case FILENAME_NDEF:
        return this.ndefDataBuffer;
      default:
        throw new Error("Unknown file");
    }
  }

  public boolean assertSelectCommand(byte[] command) {
    Boolean result = ApduHelper.commandByRangeEquals(command, 0, 13, C_APDU_SELECT);

    if (result) {
      this.hceModel.getLastState().setValue("NFC");
    }

    return result;
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

  private NdefEntity tryHandleSavedTag() {
    NdefEntity nm;

    try {
      int nlen = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(this.ndefDataBuffer, 0, 2)), 16);
      nm = NdefEntity.fromBytes(Arrays.copyOfRange(this.ndefDataBuffer, 2, 2 + nlen));
    } catch (Exception e) {
      return null;
    }

    return nm;
  }

  private byte[] respondWrite(byte[] command) {
    if (this.selectedFile != SelectedFile.FILENAME_NDEF) {
      return ApduHelper.R_APDU_ERROR;
    }

    int offset = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 2, 4)), 16);
    int length = Integer.parseInt(BinaryUtils.ByteArrayToHexString(Arrays.copyOfRange(command, 4, 5)), 16);

    byte[] data = Arrays.copyOfRange(command, 5, 5 + length);
    System.arraycopy(data, 0, ndefDataBuffer, offset, length);

    NdefEntity nm = this.tryHandleSavedTag();

    if (nm != null) {
      this.prefManager.setContent(nm.getContent());
      this.prefManager.setType(nm.getType());
      this.hceModel.getLastState().setValue("WRITE_FULL");
    } else {
      this.hceModel.getLastState().setValue("WRITE_PARTIAL");
    }

    return ApduHelper.R_APDU_OK;
  }

  public byte[] processCommand(byte[] command) {
    if (ApduHelper.commandByRangeEquals(command, 0, 5, ApduHelper.C_APDU_SELECT_FILE)) {
      return this.respondSelectFile(command);
    }

    if (ApduHelper.commandByRangeEquals(command, 0, 2, ApduHelper.C_APDU_READ)) {
      return this.respondRead(command);
    }

    if (ApduHelper.commandByRangeEquals(command, 0, 2, ApduHelper.C_APDU_WRITE)) {
      return this.respondWrite(command);
    }

    Log.i(TAG, "Unknown command.");

    return ApduHelper.R_APDU_ERROR;
  }

  @Override
  public void onDestroy(int reason) {
    this.hceModel.getLastState().setValue("DISCONNECTED");
  }
}
