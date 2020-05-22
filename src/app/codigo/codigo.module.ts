import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoPageRoutingModule } from './codigo-routing.module';

import { CodigoPage } from './codigo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    IonicModule,
    CodigoPageRoutingModule, 
    HttpClientModule
  ],
  declarations: [CodigoPage]
})
export class CodigoPageModule {}
