import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PairedDevicePagePage } from './paired-device-page.page';

const routes: Routes = [
  {
    path: '',
    component: PairedDevicePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PairedDevicePagePageRoutingModule {}
