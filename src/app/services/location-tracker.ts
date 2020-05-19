import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

import 'rxjs/add/operator/filter';
 
@Injectable({
  providedIn: 'root'
})
export class LocationTracker {
 
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
 
  constructor(public zone: NgZone, public backgroundGeolocation : BackgroundGeolocation,  public geolocation : Geolocation ) {
 
  }
 
async startTracking() {
  // Rastreamento em segundo plano
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 10, 
   // debug: true,
    interval: 5000 
  };
  await this.backgroundGeolocation.configure(config).subscribe((location) => {
   // console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
    // Executar atualização dentro da zona Angular
    this.zone.run(() => {
      this.lat = location.latitude;
      this.lng = location.longitude;
    });
  }, (err) => { 
    console.log(err); 
  });
 
  // Ligar o sistema de geolocalização em segundo plano.
  this.backgroundGeolocation.start();
 
 
  // Rastreamento de Primeiro Plano
 
let options = {
  frequency: 5000, 
  enableHighAccuracy: false
};
 
this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
 
  //console.log(position);
 
  // Executar atualização dentro da zona Angular
  this.zone.run(() => {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  });
 
});
 
}
 
stopTracking() {
 
  //console.log('stopTracking');
 
  this.backgroundGeolocation.stop();
  this.watch.unsubscribe();

  this.lat = 0;
  this.lng = 0;
 
}
 
}