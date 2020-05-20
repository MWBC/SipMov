import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';


@Injectable({
   providedIn: 'root'
})
export class Database {

   private _DB 	   : any;
   private success : boolean = true;

   constructor(public http      : HttpClient,
               public alertCtrl : AlertController)
   {
      this.initialiseDB();
   }



   initialiseDB()
   {
//   new PouchDB('pontos').destroy();
    this._DB = new PouchDB('pontos');
   }




   addPonto(auditor, title, spot,  note, image, lat, lng, date, postid, userid, website, codepath)
   {
      var timeStamp 	= new Date().toISOString(),

      //to save this within PouchDB, we HAVE to remove the first 23 characters (I.e. data:image/jpeg;base64,)
          base64String	= image.substring(23),
          ponto 	= {
    	     _id 	         : timeStamp,
             auditor 	     : auditor,
    	     title 	         : title,
    	     spot	         : spot,
    	     note 	         : note,
    	     _attachments 	 : {
    	        "ponto.jpg" : {
    	           content_type : 'image/jpeg',
    	           data 	    : base64String
    	        }
    	     },
             lat : lat,
             lng : lng,
             date: date,
             postid:postid,
             userid:userid,
             website:website,
             codepath:codepath

    	  };

      return new Promise(resolve =>
      {
         this._DB.put(ponto).catch((err) =>
         {
            this.success = false;
            console.log('DB save err : '+ err.toString());
         });

         resolve(true);

      });
   }





   updatePonto(id, auditor, title, spot,  note, image, lat, lng, date, postid, userid, revision, website, codepath)
   {
      var base64String	 = image.substring(23),
          ponto 	 = {
             _id 	     : id,
             _rev        : revision,
             auditor 	     :auditor,
             title 	     : title,
             spot 	 : spot,
             note 	     : note,
             _attachments: {
                "ponto.jpg" : {
                   content_type : 'image/jpeg',
                   data 	    : base64String
                }
             },
                lat : lat,
                lng : lng,
                date : date,
                postid : postid,
                userid: userid,
                website:website,
               codepath:codepath
          };

      return new Promise(resolve =>
      {
         this._DB.put(ponto)
         .catch((err) =>
         {
            this.success = false;
         });

         if(this.success)
         {
            resolve(true);
         }
      });
   }



   retrievePonto(id)
   {

     //we want to retrieve all attachments associated with the requested record through the {attachments: true } option) and, 
     //amongst other things, re-attaches the DataURL prefix for the image base64 string value 
     //so this can be subsequently displayed on the view template for app
      return new Promise(resolve =>
      {
         this._DB.get(id, {attachments: true})
         .then((doc)=>
         {
            var item 		= [],
		dataURIPrefix	= 'data:image/jpeg;base64,',
		attachment;

            if(doc._attachments)
            {
               attachment 	= doc._attachments["ponto.jpg"].data;
            }

            item.push(
            {
               id 	         : 	id,
               rev	         : 	doc._rev,
               auditor     :  doc.auditor,
               title	     :	doc.title,
               spot          :	doc.spot,
               note	         :	doc.note,
               image         :  dataURIPrefix + attachment,
               lat           :  doc.lat,
               lng           :  doc.lng,
               date          :  doc.date,
               postid        :  doc.postid,  
               userid        :  doc.userid,    
               website       :  doc.website,  
               codepath      :  doc.codepath,  
            });
            resolve(item);
         })
      });
   }




   retrievePontos()
   {
      return new Promise(resolve =>
      {
         this._DB.allDocs({include_docs: true, descending: true, attachments: true}, function(err, doc)
	 {
	    let k,
	        items 	= [],
	        row 	= doc.rows;

	    for(k in row)
	    {
	       var item            = row[k].doc,
	           dataURIPrefix   = 'data:image/jpeg;base64,',
	           attachment;

	       if(item._attachments)
	       {
	          attachment 	   = dataURIPrefix + item._attachments["ponto.jpg"].data;
	       }

	       items.push(
	       {
	          id 	    : 	item._id,
	          rev	    : 	item._rev,
	         auditor  :   item.auditor,
	          title	    :	item.title,
              spot      :	item.spot,
	          note	    :	item.note,
	          image     :   attachment
	       });
	    }
            resolve(items);
         });
      });
   }



   removePonto(id, rev)
   {

     
     
      return new Promise(resolve =>
      {
         var ponto   = { _id: id, _rev: rev };

         this._DB.remove(ponto)
         .catch((err) =>
         {
            this.success = false;
         });

         if(this.success)
         {
            resolve(true);
         }
      });
   }



  async  errorHandler(err)
   {
      const headsUp = await this.alertCtrl.create({
         header: 'Heads Up!',
         subHeader: err,
         buttons: ['Got It!']
      });

      await headsUp.present();
   }


}