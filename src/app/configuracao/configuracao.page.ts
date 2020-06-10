import { ToastController, AlertController, NavController } from '@ionic/angular';
import { AuthProvider } from '../services/auth/auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home.page';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'page-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss']
})

export class ConfiguracaoPage implements OnInit{

  constructor(
    public router: Router,
    public navctrl: NavController,  
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private authProv: AuthProvider, 
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
              if(dataUser.newPassword === dataUser.confirmNewPassword && dataUser.newPassword != dataUser.password){
                this.authProv.resetPassword(dataUser)
                .subscribe(
                  resp => {
                    if (resp['success']) {
                      console.log('Resp: ', resp);
                      console.log('Novo token: ', resp['token']);
                      this.storage.set('token', resp['token']);
                      this.presentToast(resp['success']);                    
                      this.navctrl.navigateRoot('/home');
                    } else {
                      console.log('Erro *Senha*', resp);
                      this.presentToast(resp['error']);
                      
                    } 
                  },e => {
                    this.presentToast('Não autorizado!');
                    this.erroPassword();
                  },/*() => {
                  }*/
                )}
                if(dataUser.newPassword != dataUser.confirmNewPassword){
                  this.presentToast('Erro, repetição da nova senha diferente da nova senha!');
                }else if(dataUser.newPassword === dataUser.password){

                  this.presentToast('Erro, a nova senha não pode ser igual a senha atual!');
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
      this.router.navigateByUrl('/login');
    })
  }

  irparacodigo() {
    this.openTodoAlert();
    this.storage.set('menuPage', 'CodigoPage');
  }
}