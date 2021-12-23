import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClientModule } from '@angular/common/http';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { BluetoothClassicSerialPort } from '@awesome-cordova-plugins/bluetooth-classic-serial-port/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { RouterModule } from '@angular/router';
import { PairedDevicePagePage } from './paired-device-page/paired-device-page.page';
import { HomePage} from './home/home.page';
import { CommonModule } from '@angular/common'; 

@NgModule({
  declarations: [AppComponent, PairedDevicePagePage],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'paired', component: PairedDevicePagePage },
      { path: 'home', component: HomePage },
    ]),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    BLE,
    BluetoothLE,
    BluetoothClassicSerialPort,
    BluetoothSerial
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
