package com.reactnativehce.services;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import android.util.Log;

import com.reactnativehce.ApduHelper;
import com.reactnativehce.HceAndroidViewModel;
import com.reactnativehce.IHCEApplication;
import com.reactnativehce.PrefManager;
import com.reactnativehce.apps.nfc.NFCTagType4;
import java.util.ArrayList;

public class CardService extends HostApduService {
    private static final String TAG = "CardService";

    private final ArrayList<IHCEApplication> registeredHCEApplications = new ArrayList<>();
    private IHCEApplication currentHCEApplication = null;
    private HceAndroidViewModel model = null;
    private PrefManager prefManager;

    @Override
    public byte[] processCommandApdu(byte[] command, Bundle extras) {
      if (currentHCEApplication != null) {
        return currentHCEApplication.processCommand(command);
      }

      if (ApduHelper.commandByRangeEquals(command, 0, 4, ApduHelper.C_APDU_SELECT_APP)) {
        for (IHCEApplication app : registeredHCEApplications) {
          if (app.assertSelectCommand(command)) {
            currentHCEApplication = app;
            this.model.getLastState().setValue("NFC");
            return ApduHelper.R_APDU_OK;
          }
        }
      }

      return ApduHelper.R_APDU_ERROR;
    }

    @Override
    public void onCreate() {
      Log.d(TAG, "Starting service");

      this.prefManager = PrefManager.getInstance(getApplicationContext());
      this.model = HceAndroidViewModel.getInstance(this.getApplicationContext());
      this.model.getLastState().setValue("CONNECTED");

      registeredHCEApplications.add(new NFCTagType4(
        prefManager.getType(),
        prefManager.getContent(),
        prefManager.getWritable()
      ));
    }

    @Override
    public void onDeactivated(int reason) {
      this.model.getLastState().setValue("DISCONNECTED");
      Log.d(TAG, "Finishing service: " + reason);
    }
}
