import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BpmRoutingModule } from './bpm-routing.module';
import { HomeComponent } from './pages/home/home.component'; 

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    BpmRoutingModule, 
  ]
})
export class BpmModule { }
