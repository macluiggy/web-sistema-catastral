import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AppRoutingModule } from './app-routing.module';
import { InicioRoutingModule } from './inicio/inicio-routing.module';
import { BpmRoutingModule } from './bpm/bpm-routing.module';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
 
// Module
import { InicioModule } from './inicio/inicio.module'; 
import { BpmModule } from './bpm/bpm.module'; 

// Primeng
import { PrimengModule } from './primeng/prime.module'; 
import { environment } from 'src/environments/environment';
import { CustomReuseStrategy } from './cache-reuse.strategy'; 
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AppInitService } from './services/app-init.service';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
export function initApp(appLoadService: AppInitService) {
  return () => appLoadService.init()
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InicioRoutingModule,
    BpmRoutingModule,
    PrimengModule,
    NgIdleKeepaliveModule.forRoot(),
    HttpClientModule,
    BpmModule,
    // InicioModule,
  ],
  providers: [
    //  {provide: LocationStrategy, useClass: PathLocationStrategy},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AppInitService,
  
    DatePipe,
   
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitService],
      multi: true,
    },
    {
      provide: "env",
      useValue: environment,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
    //{ provide: APP_BASE_HREF, useValue: "/sistema_catastral" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
