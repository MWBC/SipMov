import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { HomePageModule } from './home/home.module';
import { ApiProvider } from './services/api/api';
import { JwtHelper } from 'angular2-jwt';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AuthProvider } from './services/auth/auth';
import { LoginPage } from './login/login';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { LocationTracker } from './services/location-tracker';
import { Image } from './services/image';
import { Database } from './services/database';
import { HomePage } from './home/home.page';
import { ListagemPage } from './listagem/listagem';
import { DetailPage } from './detail/detail';
import { CodigoPage } from './codigo/codigo';
import { ConfiguracaoPage } from './configuracao/configuracao';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonApp } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AddPage } from './add/add';
import { IonicStorageModule } from '@ionic/storage';

import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    AddPage,
    DetailPage,
    CodigoPage,
    ConfiguracaoPage,
    ListagemPage,
    LoginPage
  ],
  entryComponents: [
    AppComponent, 
    HomePage,
    AddPage,
    ConfiguracaoPage,
    DetailPage,
    CodigoPage,
    ListagemPage,
    LoginPage
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
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
    ApiProvider
    ],
  bootstrap: [AppComponent] //AppComponent
})
export class AppModule {}
