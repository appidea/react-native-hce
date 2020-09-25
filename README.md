# react-native-hce

Use the NFC HCE features in Your react-native application:

- NFC Tag v4 emulation

The package currenlty is supported only by the Android platform, as Apple devices currently does not provide API nor hardware support for the
HCE.

## Installation

```sh
npm install react-native-hce --save
```

or

```sh
yarn add react-native-hce
```

Up to Your preferences and project configuration.


## Post-installation steps

After the installation, following changes must be made inside the  ``<projectRoot>/android``:

### aid_list.xml

Create new file `aid_list.xml` in `<projectRoot>/android/app/src/main/java/res/xml` directory. Create the directory, if it does not exist yet.

- Put the following content to the file:

```xml
<host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
                   android:description="@string/app_name"
                   android:requireDeviceUnlock="false">
  <aid-group android:category="other"
             android:description="@string/app_name">
    <!-- Create a separate <aid-filer /> node for each NFC application ID, that You intent to emulate/host. -->
    <!-- For the NFC tag v4 emulation, let's put "D2760000850101" -->
    <aid-filter android:name="D2760000850101" />
  </aid-group>
</host-apdu-service>
```

### AndroidManifest.xml

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
        android:name="com.reactnativehce.CardService"
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

### NFC v4 Tag emulation feature

Inspired by [underwindfall's](https://github.com/underwindfall) NFC Tag v4 communication handling used in [NFCAndroid](https://github.com/underwindfall/NFCAndroid).

**Note! If You want to use this feature, make sure that You added the proper aid to Your aid_list.xml. Otherwise, the app will not handle any signal of NFC reader related with NFC Tags v4.**

This is how to enable the NFC Tag emulation:

```js
import HCESimulation, { NFCContentType, NFCTag } from 'react-native-hce';

let simulation;

const startSimulation = async () => {
  const nfcTag = new NFCTag(NFCContentType.Text, "Foo bar.");
  simulation = new HCESimulation(nfcTag);
  await simulation.start();
}
```

stops this way:

```js
const stopSimulation = async () => {
  await simulation.terminate();
}
```

See [example](example) of the module integrated into the React Native component.

### Other features

Currently, there is no support for other applications than NFC Tag v4.

You can contribute to the library and add the other functionalities, if You eager. Looking forward to Your pull requests.

## Development roadmap

If there will be more application handled in future, the next step is to tansform this package into separate packages handled by Lerna monorepo.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
