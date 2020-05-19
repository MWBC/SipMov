import { Component } from '@angular/core';
import { AddPage } from '../add/add.page';
import { HomePage } from '../home/home.page';

import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Image } from '../services/image';
import { Database } from '../services/database';
//import { Transfer } from '@ionic-native/transfer';
import {  FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from '@angular/common/http';
import { LocationTracker } from '../services/location-tracker';

import { Storage } from '@ionic/storage';
import { DetailPage } from '../detail/detail.page';

import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

//@IonicPage()
@Component({
  selector: 'page-codigo',
  templateUrl: 'codigo.page.html',
})
export class CodigoPage {

  public default_serverUrlPart: string = "http://sispmovel.tk/public/worker/";
  public form: FormGroup;
  public pontoAuditor: any;
  public pontoSpot: any;
  public pontoTitle: any;
  public pontoNote: any;
  public pontoImage: any;
  public currentImage: any;
  public recordId: any;
  public revisionId: any;
  public isEdited: boolean = false;
  public isDeleted: boolean = false;
  public hideForm: boolean = false;
  public pageTitle: string;
  public loading: any;
  public uploadStatus: string = 'empty';

  public lastImage: string = null;
  public lat;
  public lng;
  public date;
  public postid;
  public userid;
  public pontoUserid;
  public website:string;
  public pontoWebsite ='';
  public codepath:string ='';
  public pontoCodepath;


  constructor(public navCtrl: NavController,
    public NP: NavParams,
    public fb: FormBuilder,
    public IMAGE: Image,
    public DB: Database,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public locationTracker: LocationTracker,
    public storage: Storage,
    //public view: ViewController,
    public view: ModalController, 
    public platform: Platform,
    //public geolocation: Geolocation,
    public inAppBrowser: InAppBrowser,
    public modalCtrl: ModalController

  ) {

    //this.getGeo();

    this.form = fb.group({
      "auditor": [""],
      "title": ["", Validators.required],
      "spot": [""],
      "image": ["", Validators.required],
      "note": [""],
      "lat": [""],
      "lng": [""],
      "date": [""],
      "postid": [""],
      "userid": [""],
      "website": [""],
      "codepath": [""],

    });

    this.resetFields();

    if (NP.get("key") && NP.get("rev")) {
      this.recordId = NP.get("key");
      this.revisionId = NP.get("rev");
      this.isEdited = true;
      this.selectPonto(this.recordId);
      this.pageTitle = 'Editar Auditor';
    }
    else {
      this.storage.get('auditor').then((auditor) => {
        console.log('auditor is', auditor);
        this.pontoAuditor = auditor;
      });

      this.storage.get('title').then((title) => {
        this.pontoTitle = title;
      });

      this.storage.get('userid').then((userid) => {
        this.pontoUserid = userid;
      });

      this.storage.get('website').then((website) => {
     
          this.pontoWebsite = website;
    
      });

      this.storage.get('codepath').then((codepath) => {
        this.pontoCodepath = codepath;
      });


      this.recordId = '';
      this.revisionId = '';
      this.isEdited = false;
      this.pageTitle = 'Ponto';

      this.locationTracker.lat = locationTracker.lat;
      this.locationTracker.lng = locationTracker.lng;

    }
  }

  viewDetail(param) {

    this.hideForm = false;
    this.isEdited = true;
    this.navCtrl.navigateForward('/detail', param);
  }


  selectPonto(id) {
    this.DB.retrievePonto(id)
      .then((doc) => {
        this.pontoAuditor = doc[0].auditor;
        this.pontoTitle = doc[0].title;
        this.pontoSpot = doc[0].spot;
        this.pontoNote = doc[0].note;
        this.pontoImage = doc[0].image;
        this.currentImage = doc[0].image;
        this.recordId = doc[0].id;
        this.revisionId = doc[0].rev;
        this.date = doc[0].date;
        this.locationTracker.lat = doc[0].lat;
        this.locationTracker.lng = doc[0].lng;
        this.postid = doc[0].postid;
        this.pontoUserid = doc[0].userid;
        this.pontoWebsite = doc[0].website;
        this.pontoCodepath = doc[0].codepath;
      });
  }

  savePonto() {

    var date = "";

    var auditor: string = this.form.controls["auditor"].value;
    var title: string = this.form.controls["title"].value;
    var spot: string = this.form.controls["spot"].value;
    var image: string = this.form.controls["image"].value;
    var note: string = this.form.controls["note"].value;
    var revision: string = this.revisionId;
    var id: any = this.recordId;
    var lat = this.locationTracker.lat;
    var lng = this.locationTracker.lng;
    date = this.form.controls["date"].value;
    var postid = this.form.controls["postid"].value;
    var userid = this.form.controls["userid"].value;
    var website = this.form.controls["website"].value;
    var codepath = this.form.controls["codepath"].value;

    if (auditor != "") { this.storage.set('auditor', auditor); }
    if (title != "") { this.storage.set('title', title); }
    if (userid != "") { this.storage.set('userid', userid); }
    if (website != "") { this.storage.set('website', website); }
    if (codepath != "") { this.storage.set('codepath', codepath); }


    if (this.recordId !== '') {

      this.DB.updatePonto(id, auditor, title, spot, note, image, lat, lng, date, postid, userid, revision, website, codepath)
        .then((data) => {
          this.hideForm = true;
          this.sendNotification(`${title} was updated in your ponto list`);
        });
    }
    else {
      /*  console.log( 'addPonto!!!!');
        console.log( 'auditor: ' + auditor );
        console.log( 'title: ' + title );
        console.log( 'spot: ' + spot );
        console.log( 'note: ' + note );
        console.log( 'image: ' + image );*/
        console.log( 'código do auditor: ' + userid );

      date = this.js_yyyy_mm_dd_hh_mm_ss();

      postid = this.makeid();

      this.DB.addPonto(auditor, title, spot, note, image, lat, lng, date, postid, userid, website, codepath)
        .then((data) => {
          this.hideForm = true;
          this.resetFields();
          this.sendNotification("código adicionado do auditor!");
        });
    }

    //console.log( 'uploadStatus: ' + this.uploadStatus );

    if (this.uploadStatus == 'upload') { this.upload(auditor, title, spot, note, image, lat, lng, date, postid, userid, website, codepath); }
  }


  js_yyyy_mm_dd_hh_mm_ss() {
    var now = new Date();
    var year = "" + now.getFullYear();
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }


  makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  setUploadStatus(status) {
    //   console.log('STATUS: '+status);
    this.uploadStatus = status;
  }

  takePhotograph() {
    this.IMAGE.takePhotograph()
      .then((image) => {
        this.currentImage = image.toString();
        this.pontoImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }

 async  deleteAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Você quer remover?',
      buttons: [{
        text: "remover?",
        handler: () => { this.deletePonto() }
      }, {
        text: "Cancelar",
        role: 'cancel'
      }]
    })
    alert.present();
  }

  deletePonto() {
    let title;

    this.DB.retrievePonto(this.recordId)
      .then((doc) => {
        title = doc[0].title
        return this.DB.removePonto(this.recordId, this.revisionId);
      })
      .then((data) => {
        this.hideForm = true;
        this.isDeleted = true;
        this.sendNotification(`${title} foi removido com sucesso da sua lista o auditor`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  resetFields(): void {
    this.pontoAuditor = "";
    this.pontoTitle = "";
    this.pontoSpot = "";
    this.pontoNote = "";
    this.pontoImage = "";
    this.currentImage = "";
  }

  async sendNotification(message) {
    const notification = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  } 
  /*
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  */  
  public async upload(auditor, title, spot, note, image, lat, lng, date, postid, userid, website, codepath) {

    //document.body.innerHTML = "x"+codepath+"x";
    var url ='';
    if (codepath == undefined) {
       url = this.default_serverUrlPart + "upload.php";
    } else {

       url =  codepath + '/' +  "upload.php";
    }

    // console.log("userid: " + userid);

    // File for Upload
    var targetPath = image;

    // Filename created from lat, lng data
    var filename = postid + ".jpg";

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer = new FileTransferObject();

    this.loading = await this.loadingCtrl.create({
      message: 'Enviando...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Imagem bem sucedida carregada.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('ERRO DE REDE! Erro ao fazer upload do arquivo.');
      console.log('Upload error message: ' + err.toString() + ',' + JSON.stringify(err));
    });

    var obj = { auditor: auditor, title: title, spot: spot, note: note, image: filename, lat: lat, lng: lng, date: date, mobileuserid: userid };


    var url2 ='';
    if (codepath == undefined) {
       url2 = this.default_serverUrlPart + "store.php";
    } else {

    /*  var current_codepath ='';
      if (codepath.substr(codepath.length - 1) === '/') {
        current_codepath = codepath.substr(0, codepath.length - 1);
      }*/

       url2 =  codepath + '/' + "store.php";

    }

    this.http.post(url2, obj).

      subscribe(data => {
        console.log("Informação de dados " + data);
        var resp = data;//.text().trim();
        console.log('server resp: ' + resp);

        if (resp == "success") {
          console.log(url2);
          console.log("it works!");
          this.presentToast('Dados do Ponto salvos no servidor da web');

        } else {
          console.log("Falha! Os dados do Ponto não foram salvos no servidor da web");
          console.log(resp);
        }
      }, async err => {
        console.log(err);
        // this.presentToast( 'ERRO DE REDE!');

        const alert =  await this.alertCtrl.create({
          header: 'ERRO DE REDE! SEM INTERNET',
          subHeader: 'Os dados do ponto não foram salvos no servidor da web',
          buttons: ['Next']
        });
        await alert.present();
      });

  }

  private async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    await toast.present();

  }

  close_edit() {
    this.view.dismiss();
  }

  launch(url) {

    if (url == undefined) {
      this.inAppBrowser.create("http://sispmovel.tk/public/",'_blank',{location:'yes'});
      
    } else {
       this.inAppBrowser.create(url,'_blank',{location:'yes'}); 

    }

  }

   HomePonto(){
    this.navCtrl.navigateRoot('/home');
  }

}