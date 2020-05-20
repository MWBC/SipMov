import { IonicModule, IonNav, NavParams, ToastController, AlertController, NavController } from '@ionic/angular';
import { AuthProvider } from '../services/auth/auth.service';
import { CodigoPage } from '../codigo/codigo.page';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home.page';
import { LoginPage } from '../login/login.page';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'page-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss']
})

export class ConfiguracaoPage implements OnInit{

  //@ViewChild('ionNav') ionNav: IonNav;

  constructor(
    public router: Router,
    public navctrl: NavController,  
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private authProv: AuthProvider, 
    public navParams: NavParams,
    private storage: Storage,
  ){
  }

  ngOnInit() {
  }

  async openTodoAlert(){
    const addTodoAlert = await this.alertCtrl.create({
       header: "Adicione código do administrador",
       inputs:[
         {
           type:"text",
           name:"addTodoInput"
         }],
        buttons:[
        {
          text:"Cancelar"
        },
      {
        text:"Entrar",
        handler:(inputData)=>{
          let todoText;          
          todoText = inputData.addTodoInput;
          //this.todos.push(todoText);
          if(todoText == "ipm@1234"){
          this.presentToast( 'ACESSO LIBERADO ADMINISTRADOR');
          this.router.navigateByUrl('/code');
          }else{
            this.presentToast( 'CÓDIGO ERRADO!');
          }
        }
      }]
    });
    addTodoAlert.present()
  }

  async alterarSenha() {   
    const alert = await this.alertCtrl.create({
      header: 'Altere sua senha',
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha atual',
          type: 'text'
        },
        {
          name: 'newPassword',
          placeholder: 'Nova senha',
          type: 'text'
        },
        {
          name: 'confirmNewPassword',
          placeholder: 'Repetir nova senha',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: dataUser => {
            console.log('Cancelou ', dataUser);
          }
        },
        {
          text: 'Alterar',
          handler: dataUser => {            
            console.log('dataUser: ', dataUser);
            if (dataUser.password != undefined && dataUser.newPassword != 
              undefined && dataUser.confirmNewPassword != undefined) {
              if(dataUser.newPassword === dataUser.confirmNewPassword){
                this.authProv.resetPassword(dataUser)
                .then(
                  resp => {
                    if (resp.data.success) {
                      console.log('Resp: ', resp.data.success);
                      this.presentToast(resp.data.success);                    
                      this.navctrl.navigateRoot('/home');
                    } else {
                      console.log('Erro *Senha*', resp);
                      this.presentToast(resp.error);
                      
                    } 
                  },e => {
                    this.presentToast('Não autorizado!');
                    this.erroPassword();
                  },/*() => {
                  }*/
                )}
                if(dataUser.newPassword != dataUser.confirmNewPassword){
                  this.presentToast('Erro nova senha diferente!');
                }
                // if(dataUser.password === "" && dataUser.newPassword === "" 
                // && dataUser.confirmNewPassword === ""){
                //   this.presentToast('Preencha todos os campos!');
                // }
              }else{
                this.presentToast('Preencha todos os campos!');
              }
            }
          }
      ]
    });
    alert.present();
  }

  private async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  erroPassword(){
    this.authProv.logout()
    .then(()=>{
      this.navctrl.navigateRoot('/login');
    })
  }

  irparacodigo() {
    this.openTodoAlert();
    this.storage.set('menuPage', 'CodigoPage');
  }

}