import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { RequestOptions, Headers } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class ApiProvider {

  // urlBase = 'http://sispmovel.tk/api/auth/posts/horasdia/';
  // urlMe = 'http://sispmovel.tk/api/auth/me';
   
  //localhost
  urlBase = 'http://127.0.0.1:8000/api/auth/posts/horasdia/';
  urlMe = 'http://127.0.0.1:8000/api/auth/me';
  
  constructor(
    public http: HttpClient,
    private storage: Storage,
  ){
    
  }

  getPointsList(cod, date){
    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    //this.storage.set('Bearer', this.userToken);
    //let options = new RequestOptions({ headers: headers });
    let options = {headers: headers}
    return this.http.get(this.urlBase + cod + '?ano='+ date.ano + '&mes=' + date.mes, options)
    //.map(res => res.json());
  }

  getDataMe(userToken){
    // console.log('listagem ok!')
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + userToken).set('Content-Type', 'application/json').set('Accept', 'application/json');
    console.log('token do usuario: ', userToken); 
    //this.storage.set('Bearer', this.userToken);
    //let options = new RequestOptions({ headers: headers });
    let options = {headers: headers}
    return this.http.get(this.urlMe, options)
      //.map(res => res.json());
  }
}