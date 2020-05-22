import { Router } from '@angular/router';
import { /*NavParams*/AlertController, ToastController, MenuController, IonNav } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AddPage } from '../add/add.page';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { HomePage } from '../home/home.page';
import { map } from 'rxjs/operators';

//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})

export class LoginPage implements OnInit {
  
  tipo: boolean;
  public formLogin: FormGroup;
  myPassword;
  myEmail;

  item: any = {
    //myEmail: "",
  }
  
  constructor(
    public router: Router, 
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private httpLogin: AuthProvider,
    public navCtrl: NavController,
    private toast: ToastController,
   // public navParams: NavParams,
    private network: Network,
    public storage: Storage,
    public dialog: Dialogs,
    public fb: FormBuilder,
  ){
    this.menuCtrl.enable(false);
     this.formLogin = fb.group({
      "email": ["", Validators.required],
      "password": ["", Validators.required],
    });
  }

  ngOnInit() {
    
    console.log('ionViewDidLoad LoginPage');
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
          console.log("esse é o id do usuário: ", resp['user'].id);
          //salvando o token
          sessionStorage.setItem("token", resp['token']);
          this.storage.set('token', resp['token']);
          //this.storage.set('Usuario Logado', this.item);
          if (resp) { 
            console.log(resp);
            this.router.navigateByUrl('/home');
          } else {
            console.log('Caiu no **Else: ')
            this.router.navigateByUrl('/login');
          }
        },e => {
          alert(e);
          this.loginAlert();
        },/*() => {
        }*/
      )}
  }
  
  async loginAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Aviso: Erro',
      message: 'DADOS INCORRETOS POR FAVOR TENTE NOVAMENTE!',
      buttons: [{
        text: "OK",
        handler: () => { }
      }, {
        text: "Cancelar",
        role: 'cancel'
      }]
    })
    alert.present();
  }
  
  //função do botão exibir e ocultar a senha
  exibirOuOcultar(){
   this.tipo = !this.tipo;
  }

}