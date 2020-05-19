import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { RequestOptions, Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {JwtHelper} from "angular2-jwt";
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {
  
  //url de acesso localhost
  urlBase='http://127.0.0.1:8000/api/auth/';

  //urlBase='http://sispmovel.tk/api/auth/';
  
  jwtHelper = new JwtHelper();
  user: string;
  userToken;

  // item: any = {
  //   userToken: 'token',
  // }

  constructor(
    public alertCtrl: AlertController,
    private jwtHp : JwtHelper,
    private storage: Storage,
    public http: HttpClient
  ){
    this.getStorageToken();
  }  

   loginAuth(userData){
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + JSON.stringify(userData)); 
    //console.log(userData);
//    let options = new RequestOptions({ headers: headers });
    let options = {headers: headers}
    return this.http.post(this.urlBase + 'login', userData, options)
    //.map(res => res.json());
  }

  logout() {
    return this.storage.set('token', '');
  }

  resetPassword(userData){  
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    //let options = new RequestOptions({ headers: headers });
    let options = {headers: headers}
    return this.http.post(this.urlBase + 'alterarSenha', userData, options)
 //   .map(res => res.json());    
  }

  //recupera token do armazenamento interno
  async getStorageToken(){

    const token = await this.storage.get('token')
    .then((token) => {

      if(token){
        console.log('AuthProvider ', this.userToken);
        return this.userToken = token.token;
      }else{
        console.log('Token Vazio!', this.userToken);
        return this.userToken = '';
      }
    });
  }

  private catchErrors() {
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        //handle authorization errors
        this.presentAlert('Adicione a sua Api Key!');
      } else if (res.status === 404) {
        this.presentAlert('Dado não encontrado!');
      }
      return Observable.throw(res);
    };
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      message: msg,
      buttons: [{
        text: "Entendi",
        handler: () => {  }
      }, {
        text: "Cancelar",
        role: 'cancel'
      }]
    })
    await alert.present();
  }

}