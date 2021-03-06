import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { CodigoPageModule } from './codigo/codigo.module';
import { DetailPageModule } from './detail/detail.module';
import { AddPageModule } from './add/add.module';
import { ConfiguracaoPageModule } from './configuracao/configuracao.module';
import { HTTP } from '@ionic-native/http/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { LoginPageModule } from './login/login.module';
import { Network } from '@ionic-native/network/ngx';
import { HomePageModule } from './home/home.module';
import { ApiProvider } from './services/api/api.service';
import { JwtHelper } from 'angular2-jwt';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AuthProvider } from './services/auth/auth.service';
import { ResendPointService } from './services/resend-point.service';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { LocationTracker } from './services/location-tracker.service';
import { Image } from './services/image.service';
import { Database } from './services/database.service';

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonApp } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IonicStorageModule } from '@ionic/storage';


import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    LoginPageModule, 
    ConfiguracaoPageModule, 
    AddPageModule, 
    HomePageModule, 
    DetailPageModule, 
    CodigoPageModule, 
    ReactiveFormsModule, 
    IonicModule.forRoot(), 
    /*RouterModule.forRoot([
      { path: 'home', loadChildren: './home/home.module#HomePageModule' },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]), */
    //AppRoutingModule, 
    IonicStorageModule.forRoot({
      name: 'pontoDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera, 
    Network, 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    LocationTracker,
    BackgroundGeolocation,
    Geolocation,
    StatusBar,
    SplashScreen,
    JwtHelper,
    Dialogs,
    InAppBrowser,
    AndroidFingerprintAuth,
    {provide: ErrorHandler, useClass: ErrorHandler}, Database, Image,
    AuthProvider,
    ApiProvider, 
    HTTP, 
    FingerprintAIO, 
    NavigationBar, 
    ResendPointService
    ],
  bootstrap: [AppComponent] //AppComponent
})
export class AppModule {}
