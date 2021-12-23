import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { BluetoothClassicSerialPort } from '@awesome-cordova-plugins/bluetooth-classic-serial-port/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  place: string = '';
  type: string = '';
  icon: string = '';
  temperature: string = '';

  devices: any[] = [];
  statusMessage: string = '';
  parsedData: any = '';

  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;

  constructor(public httpClient: HttpClient,
    public geolocation: Geolocation,
    public platform: Platform,
    private ble: BLE,
    private ngZone: NgZone,
    private ble_classical_serial: BluetoothClassicSerialPort,
    private ble_serial: BluetoothSerial
  ) { }

  listPairedDevices() {

    this.ble_serial.list().then(success => {
      console.log('Devices: ');
      console.log(success);
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      console.log("Please enable bluetooth")
    });
  }

  showWeather() {
    this.platform.ready().then(() => {
      this.GetCurrentLocation();
    });
  }

  scan() {
    this.platform.ready().then(() => {
      this.setStatus("Scanning for Bluetooth LE Devices");
      this.devices = [];
      this.ble.scan([], 15).subscribe(device => this.onDeviceDiscovered(device));

      setTimeout(this.setStatus.bind(this), 15000, "Scan complete");
    });
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      console.log(device);

      // var adData = new Uint8Array(device.advertising);
      this.parsedData = this.parseAdvertisingData(device.advertising);

      console.log('parsed ad data: ' + this.parsedData);
      console.log('type: ' + typeof (this.parsedData));

    });
  }

  parseAdvertisingData(buffer) {
    var length, type, data, i = 0, advertisementData = {};
    var bytes = new Uint8Array(buffer);

    while (length !== 0) {
      length = bytes[i] & 0xFF;
      i++;
      // decode type constants from https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
      type = bytes[i] & 0xFF;
      i++;

      data = bytes.slice(i, i + length - 1).buffer; // length includes type byte, but not length byte
      i += length - 2;  // move to end of data
      i++;
      advertisementData[this.asHexString(type)] = data;
    }
    return advertisementData;
  }

  asHexString(i) {
    var hex;
    hex = i.toString(16);

    // zero padding
    if (hex.length === 1) {
      hex = "0" + hex;
    }

    return "0x" + hex;
  }

  GetCurrentLocation() {
    this.geolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true
    }).then((resp) => {
      var latitude = resp.coords.latitude;
      var longitude = resp.coords.longitude;
      this.GetCurrentTemperature(latitude, longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  GetCurrentTemperature(latitude, longitude) {
    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=45469887a0d6cb71fd4829cc2fba2534";
    this.httpClient.get(url).subscribe((temperatureData) => {
      var obj = <any>temperatureData;
      console.log(obj);
      this.place = obj.name;
      this.type = obj.weather[0].main;
      this.icon = "https://openweathermap.org/img/w/" + obj.weather[0].icon + '.png';
      this.temperature = ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString() + ' °C';
    });
  }

  connectToDevice(device, name) {
    this.ble.connect(device.id).subscribe(success => {
      console.log("successfully connected to: " + device.name);
    }, error => {
      console.log('Error: connecting to device');
    })
  }

}

interface pairedlist {
  class: number,
  id: string,
  address: string,
  name: string
}