import { ConfiguracaoPage } from './configuracao/configuracao.page';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ListagemPage } from './listagem/listagem.page';
import { ViewChild } from '@angular/core';
import { CodigoPage } from './codigo/codigo.page';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { IonNav, ToastController, AlertController } from '@ionic/angular';
import { AddPage } from './add/add.page';
import { Storage } from '@ionic/storage';
import { AuthProvider } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //@ViewChild('ionNav') ionNav: IonNav;

  rootPage:any = LoginPage;
  activePage: any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(

    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private authProv: AuthProvider, 
    private storage: Storage,

    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    
    private router: Router
  ) {

    this.initializeApp();
    this.pages = [
      { title: 'Listagem de Ponto', component: ListagemPage, icon: "home" },
      { title: 'Bater o Ponto', component: HomePage, icon: "home" },
      { title: 'Configuração', component: ConfiguracaoPage, icon: "home"}
    ];
    this.activePage = this.pages[1];
    this.router.navigateByUrl('/login');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.navCtrl.navigateRoot(page.component);
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
      this.navCtrl.navigateRoot('/login');
    })
  }

  // logout() {
  //   this.storage.set('token', '');
  //   this.nav.setRoot(LoginPage);
  //   //console.log('deslogado com sucesso.')
  // }
}
