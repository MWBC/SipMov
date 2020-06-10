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

  monthNames = [{'mes': 'Janeiro', 'month': 'January'}, {'mes': 'Fevereiro', 'month': 'February'}, {'mes': 'Março', 'month': 'March'}, {'mes': 'Abril', 'month': 'April'}, {'mes': 'Maio', 'month': 'May'}, {'mes': 'Junho', 'month': 'June'}, {'mes': 'Julho', 'month': 'July'}, {'mes': 'Agosto', 'month': 'August'}, {'mes': 'Setembro', 'month': 'September'}, {'mes': 'Outubro', 'month': 'October'}, {'mes': 'Novembro', 'month': 'November'}, {'mes': 'Dezembro', 'month': 'December'}];
  meuPonto:any = [];
  coutDay;
  cod = '';

  totalHours;
  hojeData;
  showData;
  date;
  ano;
  mes;

  item: any = {
    mes: "",
  }

  constructor(
    public navCtrl: NavController, 
    private apiServ: ApiProvider,
    private storage: Storage,
  ){
    
  }

  ngOnInit(){}

  ionViewWillEnter(){

    // Inicializa a lista de ponto com o mes e o ano atuais
    this.dataHoje();
    
    this.storage.get('token').then((userToken)=>{
      this.getDataMe(userToken)
    });
  }

  getDataMe(userToken){
  
    this.apiServ.getDataMe(userToken)
    .subscribe(
        data => {
          //sessionStorage.setItem("token",  data.token);
          //this.storage.set('token',  data.token);
          console.log('Data )=> ', data);
          this.cod = data['user']['mobileuserid'];
          this.getPointsList();
        }
      );
  }

  dataHoje(){
    let tempData = new Date().toISOString();
    console.log('DATA: ', tempData);
    let mes = tempData.slice(5, 7)
    let date = {
      'ano':tempData.slice(0, 4),
      'mes':this.monthNames[parseInt(mes)-1].month
    }
    this.hojeData = date;
    //this.storage.set('mes', this.monthNames[parseInt(mes)-1].mes);
    console.log('date: ', this.monthNames[parseInt(mes)-1].mes);
  }

  pesquisaData(){
    let date = {
      'ano': this.ano,
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