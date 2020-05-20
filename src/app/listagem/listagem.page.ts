import { NavController, NavParams } from '@ionic/angular';
import { ApiProvider } from '../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import * as moment from 'moment';

@Component({
  selector: 'page-listagem',
  templateUrl: 'listagem.page.html', 
  styleUrls: ['listagem.page.scss']
})
export class ListagemPage implements OnInit {

  monthNames = [{'mes':'January'}, {'mes':'February'}, {'mes':'March'}, {'mes':'April'}, {'mes':'May'}, {'mes':'June'}, {'mes':'July'}, {'mes':'August'}, {'mes':'September'}, {'mes':'October'}, {'mes':'November'}, {'mes':'December'}];
  meuPonto:any = [];
  coutDay;
  cod = 'teste123';

  totalHours;
  hojeData;
  showData;
  date;
  ano;
  mes;

  anoOptions = {
    title: 'Selecione o ano',
    mode: 'md'
  };

  mesOptions = {
    title: 'Selecione o mês',
    mode: 'md'
  };

  item: any = {
    mes: "",
  }

  constructor(
    public navCtrl: NavController, 
    private apiServ: ApiProvider,
    public navParams: NavParams,
    private storage: Storage,
  ){
    // Inicializa a lista de ponto com a data hoje
    this.dataHoje();
    //this.getPointsList();
    
    this.storage.get('token').then((userToken)=>{
      this.getDataMe(userToken)
    });
  }

  ngOnInit(){}

  getDataMe(userToken){
  this.apiServ.getDataMe(userToken)
  .subscribe(
      data => {
        //sessionStorage.setItem("token",  data.token);
        //this.storage.set('token',  data.token);
        this.cod = data['mobileuserid'];
        this.getPointsList();
        console.log('Data )=> ', data);
      }
    );
  }

  dataHoje(){
    let tempData = new Date().toISOString();
    let mes = tempData.slice(5, 7)
    let date = {
      'ano':tempData.slice(0, 4),
      'mes':this.monthNames[parseInt(mes)-1].mes
    }
    this.hojeData = date;
    //this.storage.set('mes', this.monthNames[parseInt(mes)-1].mes);
    console.log('date: ', this.monthNames[parseInt(mes)-1].mes);
  }

  pesquisaData(){
    let date = {
      'ano':'2020',
      'mes':this.mes
    }
    this.hojeData = date;    
    this.getPointsList();
  }

  getPointsList(){    
    this.apiServ.getPointsList(this.cod, this.hojeData)    
    .subscribe(
      data => {
        this.meuPonto = data;
        if(this.meuPonto.user.length>0){
          this.coutDay = this.meuPonto.count;
          this.calcHoras(this.meuPonto['posts']);
        }else{
          this.coutDay = '0'
        }
        console.log('Ponto )=> ', data);
      }
    );
  }

  calcHoras(hPontos){
    let hours = [];
    hPontos.forEach(element => {
      hours.push(element.diferenca);
    });
    const myHours = hours;
    const totalHours = myHours.reduce((acc, time) => acc.add(moment.duration(time)), moment.duration());
    this.totalHours = [Math.floor(totalHours.asHours()), totalHours.minutes(), totalHours.seconds()].join(':');
    console.log('totalHours: ', this.totalHours); 
  }

   // usuário aparecer na listagem
  // getPointsList(){    
  //   this.apiServ.getPointsList(this.cod, this.hojeData)    
  //   .subscribe(
  //     data => {
  //       this.meuPonto = data;
  //       if(this.meuPonto.user.length>0){
  //         this.userName = this.meuPonto.user[0].name;
  //       }else{
  //         this.userName = 'Usuário Sipmov'
  //       }
  //       console.log('Ponto )=> ', data);
  //     }
  //   );
  // }

}