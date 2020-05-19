import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

//https://forum.ionicframework.com/t/ionic-native-cannot-find-module-ionic-native/87875/2
//import { Camera } from 'ionic-native';
//import { Camera } from '@ionic-native/camera';
import { Camera } from '@ionic-native/camera';


@Injectable({
   providedIn: 'root'
})
export class Image {

   public cameraImage : String

   constructor(public http: HttpClient, private camera: Camera)
   {

   }

//https://github.com/apache/cordova-plugin-camera
//https://forum.ionicframework.com/t/ionic-native-cannot-find-module-ionic-native/87875/2
//https://ionicframework.com/docs/native/camera/

   takePhotograph()
   {
      return new Promise(resolve =>
      {
         this.camera.getPicture(
	     {
	        destinationType : this.camera.DestinationType.DATA_URL,
	        targetWidth 	: 1024,
	        targetHeight	: 768
	     })
	     .then((data) =>
	     {
	        this.cameraImage 	= "data:image/jpeg;base64," + data;
	        resolve(this.cameraImage);
	     });
      });
   }


//this freezes the phone
  /* selectPhotograph()
   {
      return new Promise(resolve =>
      {
         let cameraOptions = {
             sourceType         : this.camera.PictureSourceType.PHOTOLIBRARY,
             destinationType    : this.camera.DestinationType.DATA_URL,
	         quality            : 100,
	         targetWidth        : 640,
	         targetHeight       : 480,
	         encodingType       : this.camera.EncodingType.JPEG,
	         correctOrientation : true
         };

         this.camera.getPicture(cameraOptions)
         .then((data) =>
         {
            this.cameraImage 	= "data:image/jpeg;base64," + data;
	    resolve(this.cameraImage);
         });

      });
   }*/

}