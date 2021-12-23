import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouterModule, RouterPreloader } from '@angular/router';

import { PairedDevicePagePageRoutingModule } from './paired-device-page-routing.module';

import { PairedDevicePagePage } from './paired-device-page.page';

import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  imports: [
    BrowserModule,
    IonicRouteStrategy,
    RouterPreloader,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PairedDevicePagePageRoutingModule
  ],
  declarations: [PairedDevicePagePage]
})
export class PairedDevicePagePageModule {

}

