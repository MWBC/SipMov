import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Database } from '../services/database.service';
import { ElementRef, ViewChild } from '@angular/core';

import { LocationTracker } from '../services/location-tracker.service';

//import { Injectable, NgZone } from '@angular/core';

import {  FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from '@angular/common/http';


import { Storage } from '@ionic/storage';

import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'page-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit{

  public pontoAuditor	 	: any;
   public pontoSpot 	: any;
   public pontoTitle	 	: any;
   public pontoNote		    : any;
   public pontoImage  		: any;
   public date;
   public pontoLat;
   public pontoLng;

  constructor(
  public route: ActivatedRoute, 
  public navCtrl: NavController, 
  public navParams: NavParams,
  public DB       	: Database,
  public view: ModalController
   
  ) {}

  ngOnInit() {
   // console.log('ionViewDidLoad DetailPage');
   //let id = this.navParams.get('id');
   let id = this.route.snapshot.paramMap.get('id');
   this.selectPonto(id);
  }

     selectPonto(id)
   {
      this.DB.retrievePonto(id)
      .then((doc)=>
      {
         this.pontoAuditor		= doc[0].auditor;
         this.pontoTitle			= doc[0].title;
         this.pontoSpot 		= doc[0].spot;
         this.pontoNote 			= doc[0].note;
         this.pontoImage 			= doc[0].image;
         this.date 			= doc[0].date;
         this.pontoLat = doc[0].lat;
         this.pontoLng = doc[0].lng;
      });
   }


 close(){
   this.view.dismiss();
  } 

}