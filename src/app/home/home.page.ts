import { Router } from '@angular/router';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { LocationTracker } from '../services/location-tracker.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Database } from '../services/database.service';
import { LoadingController } from '@ionic/angular';
import { AddPage } from '../add/add.page';
import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from "@ionic/storage";

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: './home.page.html', 
  styleUrls: ['./home.page.scss']
})

export class HomePage {

  public hasPontos: boolean = false;
  public pontos: any;
  public loader;

  //teste de atualizacao do navController para ionNav
  pages: Array<{title: string, component: any, icon: string}>;

  public showStartTrackButton: boolean = true;
  public showStopTrackButton: boolean = false;

  constructor(
    private navCtrl: NavController, 
    private router: Router, 
    private androidFingerprintAuth: AndroidFingerprintAuth,
    public locationTracker: LocationTracker,
    private alertCtrl : AlertController,
    public loading: LoadingController,
    public menuCtrl: MenuController,
    public platform: Platform,
    public DB: Database,
    public storage: Storage
  ) {  }

  async ionViewWillEnter() {

    this.menuCtrl.enable(true);
    this.loader = await this.loading.create({
      message: 'Carregamento de conteúdo...',
    });

    await this.loader.present().then(() => {
      this.displayPontos();

    });

  }

  launch(url) {
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(url, '_blank', 'location = yes');

    });
  }


  startTrack() { 

    this.locationTracker.startTracking();

    this.showStartTrackButton = false;
    this.showStopTrackButton = true;

  }


  stopTrack() {
    this.locationTracker.stopTracking();

    this.showStartTrackButton = true;
    this.showStopTrackButton = false;
  }


  displayPontos() {
    this.DB.retrievePontos().then((data) => {
      this.pontos = data;
      console.log('pontos: ', this.pontos);
      //console.log('ponto data: ' + this.pontos[0].id);
      this.loader.dismiss();

    },).catch(error => console.log('erro ao recuperar pontos', error));
  }

  addPonto() {
    this.router.navigateByUrl('/store');
  }

  viewPonto(param) {
    this.router.navigate(['/store', {param: param}]);
  }

  HomePonto() {
    this.router.navigateByUrl('/home');
  }

  fingerPrintDigital(){
    
  this.androidFingerprintAuth.isAvailable()
  .then((result)=> {
    if(result.isAvailable){
      this.androidFingerprintAuth.encrypt({ 
        clientId: 'myAppName', 
        username: '', 
        password: '', 
        locale: 'pt',
        disableBackup: true })
        .then(result => {
           if (result.withFingerprint) {
               console.log('Successfully encrypted credentials.');
               console.log('Encrypted credentials: ' + result.token);
               this.router.navigateByUrl('/store');
           } else if (result.withBackup) {
             console.log('Successfully authenticated with backup password!');
           } else console.log('Didn\'t authenticate!');
        })
         .catch(error => {
            if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
              console.log('Fingerprint authentication cancelled');
              this.stopTrack();
            } else console.error(error)
         });

    } else {
       
       var title: 'fingerprint scanner isnt available'
       this.basicAlert(title,'');
    }
  })
  .catch(error => console.error(error));
}

 async basicAlert(title,subTitle){
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: subTitle
    });
    await alert.present();
  }

}