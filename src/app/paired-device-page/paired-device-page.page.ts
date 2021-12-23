import { Component, OnInit } from '@angular/core';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { ToastController, AlertController, Platform } from '@ionic/angular';

import { BluetoothClassicSerialPort } from '@awesome-cordova-plugins/bluetooth-classic-serial-port/ngx';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';


@Component({
  selector: 'app-paired-device-page',
  templateUrl: './paired-device-page.page.html',
  styleUrls: ['./paired-device-page.page.scss'],
})
export class PairedDevicePagePage implements OnInit {

  pairedList: pairedlist;
  listDevices: any[] = [];
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = '';

  constructor(
    private ble: BLE,
    private bluetoothle: BluetoothLE,
    private alertCtrl: AlertController,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private bluetoothClassicSerial: BluetoothClassicSerialPort,
    public plt: Platform) {
    this.plt.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status) // logs 'enabled'
      });

    });
  }

  ngOnInit() {
    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {

    }, error => {
      this.showError("Error: " + error + ". Please enable bluetooth!");
    })
  }

  listIOSPairedDevices() {
    this.bluetoothClassicSerial.list().then(success => {
      this.listDevices = success;
    }, error => {
      this.showError("Error: " + error + ". Please enable bluetooth!");
      this.listToggle = false;
    })
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError("Error: " + error + ". Please enable bluetooth!");
      this.listToggle = false;
    })
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;
    this.showToast("Trying to connecting to  " + name + "; Address: " + address);

    this.connect(connectedDevice);
  }

  connect(connectedDevice) {

    if (this.plt.is('mobile') && this.plt.is('android')) {
      console.log('This is an android device');

    } else if (this.plt.is('mobile') && this.plt.is('android')) {
      console.log("This is an ios device");
    } else {
      console.log("Flatform Error: Must run on an Android or ios device!");
    }

    this.bluetoothSerial.connect(connectedDevice.address).subscribe(
      success => {
        console.log(JSON.stringify(success));
        this.isConnected();
      }
      , error => {
        this.showError("Connection ERROR: " + JSON.stringify(error));
      }
    )
  }

  isConnected() {
    this.bluetoothSerial.isConnected().then(success => {
      this.showToast("Device is connected: " + JSON.stringify(success));
    },
      error => {
        this.showError("ble Check Connection Error: " + JSON.stringify(error));
      }
    );
  }

  sendData() {
    this.dataSend += '\n';
    this.showToast(this.dataSend);

    this.bluetoothSerial.write(this.dataSend).then(success => {
      this.showToast(this.dataSend + ' sent :' + success);
    }, error => {
      this.showError('ERROR: ' + error);
    })

  }

  async showError(error) {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000
    });
    await toast.present();
  }

}

interface pairedlist {
  class: number,
  id: string,
  address: string,
  name: string
}
