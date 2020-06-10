import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //rootPage:any = LoginPage;
  activePage: any;

  pages: Array<{title: string, path: any, icon: string}>;

  constructor(

    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private authProv: AuthProvider, 
    private storage: Storage,

    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    
    private router: Router, 
  ) {

    this.initializeApp();
    this.pages = [
      { title: 'Listagem de Ponto', path: '/pontos', icon: 'home'},
      { title: 'Bater o Ponto', path: '/home', icon: 'home' },
      { title: 'Configuração', path: '/config', icon: 'home'}
    ];
    this.activePage = this.pages[1];
    //this.router.navigateByUrl('login');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.router.navigateByUrl(page.path);
    this.activePage = page;
  }
  checkActive(page){
    return page == this.activePage;
  }
  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  logout(){
    this.authProv.logout()
    .then(()=>{
      this.router.navigateByUrl('/login');
    })
  }
}
