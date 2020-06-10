import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResendPointService {

  constructor(
    private network: Network, 
    private http: HttpClient
  ) { }

    resendPoint(obj: any){
    
    let self = this;
    const url = 'http://127.0.0.1:8000/api/auth/posts/store';

    const conect = this.network.onConnect().subscribe(data => {

      const interval = setInterval(function(){

        self.http.post(url, obj).subscribe(result => {

          if(result){

            console.log('Ponto salvo no servidor com sucesso!');
            clearInterval(interval);
          }
        }
        , error => console.log('OCORREU O SEGUINTE ERRO: ', error));
      }, 2000);    
      console.log(data);
      console.log('RETORNO DO ONCONECT!');
      conect.unsubscribe();
    }, error  => {
      console.log(error);
    });
  }
}
