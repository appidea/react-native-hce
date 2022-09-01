<p align="center">
  <img src="logo.png" alt="React Native HCE">
</p>
<p align="center">
  <i>
    Adds Host card emulation (HCE) capabilities to React Native
  </i>
</p>

---

**Host Card Emulation** is the technology in Android Devices, that let the device act as a host in the NFC communication. This technology can be used, e.g. to simulate the passive smart cards or NFC tags.
This package allows the ``react-native`` application to use the adventages of this technology.

For now, the only out-of-the-box solution provided by this package is:

- NFC Type 4 tag emulation

anyways, the module's architecture is ready to engage also the other usages.

## Important notes

- The package currenlty is supported **only on the Android platform**, as Apple devices currently does not provide API nor hardware support for the HCE.
- Compatibility note: **HCE has been introduced with Android v4.4**, so app will be working correctly only when SDK version >= 19

## Installation

```sh
npm install react-native-hce --save
```

or

```sh
yarn add react-native-hce
```

...up to Your preferences and project configuration.

Autolinking should tak care about the rest (the extension has been tested at least on the ``react-native@0.62.2``)


## Post-installation steps

After the installation, following changes must be made inside the  ``<projectRoot>/android``:

### aid_list.xml

Create new file `aid_list.xml` in `<projectRoot>/android/app/src/main/res/xml` directory. Create the directory, if it does not exist yet.

- Put the following content to the file:

```xml
<host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
                   android:description="@string/app_name"
                   android:requireDeviceUnlock="false">
  <aid-group android:category="other"
             android:description="@string/app_name">
    <!-- Create a separate <aid-filer /> node for each NFC application ID, that You intent to emulate/host. -->
    <!-- For the NFC Type 4 tag emulation, let's put "D2760000850101" -->
    <aid-filter android:name="D2760000850101" />
  </aid-group>
</host-apdu-service>
```

### AndroidManifest.xml

Open the app's manifest (``<projectRoot>/android/app/src/main/AndroidManifest.xml``):

- Add permission to use NFC in the application, and add the declaration of usage the HCE feature:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example.reactnativehce">

    <uses-permission android:name="android.permission.INTERNET" />

    <!-- add this: -->
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature android:name="android.hardware.nfc.hce" android:required="true" />
```

- HCE emulation on the Android platform works as a service. ``react-native-hce`` module communicating with this service, so that's why we need to place the reference in AndroidManifest.

```xml
<application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">

    <!-- ... -->

    <!-- Add the following block: -->
    <service
        android:name="com.reactnativehce.services.CardService"
        android:exported="true"
        android:enabled="false"
        android:permission="android.permission.BIND_NFC_SERVICE" >
        <intent-filter>
          <action android:name="android.nfc.cardemulation.action.HOST_APDU_SERVICE" />
          <category android:name="android.intent.category.DEFAULT"/>
        </intent-filter>

        <meta-data
          android:name="android.nfc.cardemulation.host_apdu_service"
          android:resource="@xml/aid_list" />
    </service>
    <!-- ... -->
</application>
```

That's it.

## Usage

You can clone the repository and try out the [example react-native app](example), that implements this module.

### NFC Type 4 tag emulation feature

Inspired by [underwindfall's](https://github.com/underwindfall) NFC Type 4 tag communication handling used in [NFCAndroid](https://github.com/underwindfall/NFCAndroid).

**Note! If You want to use this feature, make sure that You added the proper aid to Your ``aid_list.xml``. Otherwise, the app will not handle any signal of NFC reader related with NFC Tags v4.**

This is how to enable the NFC Tag emulation:

```js
import HCESession, { NFCContentType, NFCTagType4 } from 'react-native-hce';

let session;

const startSession = async () => {
    const tag = new NFCTagType4({
      type: NFCContentType.Text,
      content: "Hello world",
      writable: false
    });

    session = await (new HCESession(tag)).start();
}

startSession();
```

stops this way:

```js
const stopSession = async () => {
  await session.terminate();
}

stopSimulation();
```

It is possible to listen for events during the emulation:

```js
const listen = async () => {
  const listener = session.addListener('hceStatus', (currentStatus) => {
    switch (currentStatus) {
      case "CONNECTED":
        // HCE transmission has been routed to the application.
        // It means, user tapped the phone to the reader, and reader have sent matching Select Application command.
        break;
      case "NFC":
        // NFC Tag application has been selected.
        break;
      case "DISCONNECTED":
        // HCE transmission has been terminated
        break;
    }
  });

  // to remove the listener:
  listener.remove();
}

listen();
```

See [example](example/src/App.tsx) of the module integrated into the React Native component.

### Other features

This project is opened for Your ideas. You can contribute to the library and add the other functionalities, if You eager.

### Troubleshooting

- Ensure, that there is no AID conflict with other HCE-enabled apps. Try to disable all HCE-enabled apps except the Your one. You can do this in Android Settings. [See more details...](https://github.com/appidea/react-native-hce/issues/2#issuecomment-1221538916)
- If You experience the issues when trying to start up the example application, ensure, that You follow the steps described in [contribution guide](CONTRIBUTING.md).

## Development roadmap

- support for more types of NDEF Messages
- support for writable NFC Tags
- support for development of custom applications

## Contributing

This project has been bootstrapped with [Bob](https://github.com/react-native-community/bob.git).

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
