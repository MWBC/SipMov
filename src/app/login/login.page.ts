import { Router } from '@angular/router';
import { AlertController, ToastController, MenuController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage"

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})

export class LoginPage implements OnInit {
  
  tipo: boolean;
  public formLogin: FormGroup;
  
  constructor(
    public router: Router, 
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private httpLogin: AuthProvider,
    public navCtrl: NavController,
    private toast: ToastController,
    private network: Network,
    public storage: Storage,
    public dialog: Dialogs,
    public fb: FormBuilder,
  ){
    
     this.formLogin = fb.group({
      "email": ["", Validators.required],
      "password": ["", Validators.required],
    });
  }

  ngOnInit() {
    
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter(){

    this.menuCtrl.enable(false);
  }

  async displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type

    const t = await this.toast.create({
      message: `Você está agora ${connectionState}`,
      //via ${networkType} é o tipo de internet wifi,4g.
      duration: 9000
    })
    t.present();
  }

  ionViewDidEnter(){
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
      //alert('Internet conectada: -()')
    }, error => console.error(error));
    
    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
      //alert('Não tem Internet: -()')
    }, error => console.error(error));

  }

  login() {
    let email: string = this.formLogin.controls["email"].value;
    let password: string = this.formLogin.controls["password"].value;
    if (this.formLogin.controls["email"].value !== undefined || this.formLogin.controls["password"].value !== undefined) {
      let userData = {
        'email': email,
        'password': password
      }
      this.httpLogin.loginAuth(userData)
      .subscribe(
        resp => {
          console.log("esse é o token ", resp['token']);
          //salvando o token
          sessionStorage.setItem('token', resp['token']);
          this.storage.set('token', resp['token']); 
          
          if (resp) { 
            console.log(resp);
            this.router.navigateByUrl('/home');
          } else {
            console.log('Caiu no **Else: ')
            this.router.navigateByUrl('/login');
          }
        },e => {
          
          this.loginAlert(e);
        },/*() => {
        }*/
      )}
  }
  
  async loginAlert(e) {

    if(e.status == 401){

      const alert = await this.alertCtrl.create({
        cssClass: 'customAlert', 
        header: 'Aviso: Erro 401',
        message: 'EMAIL OU SENHA INCORRETOS, POR FAVOR VERIFIQUE E TENTE NOVAMENTE!',
        buttons: [{
          text: "OK",
          handler: () => { }
        }]
      })
      alert.present();
    }else{

      const alert = await this.alertCtrl.create({
        cssClass: 'customAlert', 
        header: 'Aviso: Erro ' + e.status,
        message: 'OCORREU UM ERRO, POR FAVOR TENTE NOVAMENTE!',
        buttons: [{
          text: "OK",
          handler: () => { }
        }]
      })
      alert.present();
    }
    
  }
  
  //função do botão exibir e ocultar a senha
  exibirOuOcultar(){
   this.tipo = !this.tipo;
  }

}