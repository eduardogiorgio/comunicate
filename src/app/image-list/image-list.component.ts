import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  latestData : string;
  images: any[];
  imagesFound: boolean = false;
  searching: boolean = false;
  currentPage: number;
  totalImages: number;
  // ver que ya lo tenga el servicio en su modulo
  //TODO: que valla en un modulo asi es mas facil de manejar
  //grasycale imagen mientras no termine  para que paresca que carga mas rapido
  settings: Settings;

  constructor (private modalController: ModalController,private _imageService : ImageService,private settingsService: SettingsService,) {
  }

  ngOnInit() {
    this.getSettings();
    this.images =[];
  }

  handleSuccess(data){
    this.imagesFound = true;

    const elements : any[] = data.hits;
    // solamente pushear si no existe para asegurarme de no repetir
    elements.forEach(element => {
      this.images.push(element);
    });
    
    this.totalImages = data.total;
    console.log(data.hits);
  }

  handleError(error){
    console.log(error);
  }

 // esto ya estaria.
  searchImages(query: string){
    this.searching = true;
    // limpia las imagenes si cambia el texto
    this.images =[];

    return this._imageService.getImages(query,1,10).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error),
      () => this.searching = false
    )
  }

  // currentPage
/*
 // oInfinite(query: string): Promise<any> {
  oInfinite(query: string){
    console.log('Begin async operation');

    this.searching = true;
    return this._imageService.getImages(query,1,10).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error),
      () => this.searching = false
    );

    
    //return new Promise((resolve) => {
    //  setTimeout(() => {
    //    for (var i = 0; i < 30; i++) {
    //      this.items.push( this.items.length );
    //    }
//
  //      console.log('Async operation has ended');
   //     resolve();
   //   }, 500);
  //  })
    
  }
  */

  dismiss() {
    this.modalController.dismiss();
  }

  getSettings() {
    this.settings = this.settingsService.loadSettings();
  }
}
