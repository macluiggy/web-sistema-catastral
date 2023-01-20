import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
 
// Primeng
import { PrimengModule } from './../primeng/prime.module'; 
import { HeaderComponent } from '../components/header/header.component';
import { MenuComponent } from '../components/menu/menu.component';

@NgModule({
  declarations: [
    InicioComponent, 
    HeaderComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,  
    PrimengModule,
  ]
})
export class InicioModule { }
