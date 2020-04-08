import { ViewChild, OnInit, Component } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';
import { observable, Observable } from 'rxjs';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  environment = environment;
  query: string;
  latestData : string;
  images: any[];
  imagesFound: boolean = false;
  searching: boolean = false;
  currentPage: number;
  totalImages: number;
  PER_PAGE: number = 10;
  // ver que ya lo tenga el servicio en su modulo
  //TODO: que valla en un modulo asi es mas facil de manejar
  //grasycale imagen mientras no termine  para que paresca que carga mas rapido

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  settings: Settings;

  constructor (private modalController: ModalController,private _imageService : ImageService,private settingsService: SettingsService,private transfer: FileTransfer, private file: File) {
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

    // verifica si debe desabilitar scroll
    // mover el 10 valor estatico
    console.log(this.currentPage * this.PER_PAGE , this.totalImages);

    // Mostrar no existen imagenes disponibles

    if(this.currentPage * this.PER_PAGE > this.totalImages){
      this.infiniteScroll.disabled = true;
    }
  }

  handleError(error){
    console.log(error);
  }

 // esto ya estaria.
  searchImages(query: string){
    if(!query){
      this.images = [];
      return;
    }
    this.query = query;
    this.searching = true;
    // limpia las imagenes si cambia el texto
    this.images =[];
    
    this.infiniteScroll.disabled = false;
    this.currentPage = 1;
    return this._imageService.getImages(this.query,this.currentPage,10).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error),
      () => this.searching = false
    )
  }

  // currentPage

 // oInfinite(query: string): Promise<any> {
  doInfinite(event : any){

    console.log(this.currentPage * this.PER_PAGE,this.totalImages);

    //this.searching = true;
    this.currentPage = this.currentPage + 1;
    return this._imageService.getImages(this.query,this.currentPage,this.PER_PAGE).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error),
      () => {
           //   this.searching = false;
              event.target.complete();
            }
    );

   
  }

  selectedImage(image: any){

    const fileTransfer: FileTransferObject = this.transfer.create();
    //const url = image.largeImageURL;
    const url = image.webformatURL; // es mas liviana
    fileTransfer.download(url, this.file.dataDirectory + 'image-cache',true,{create: true, exclusive: false}).then((entry) => {
      //console.log(image.largeImageURL);
      //console.log('download complete: ' + entry.toURL());
      
      // verificar que esto me de el archivo
      console.log(entry);
      this.modalController.dismiss(entry.toURL());
    }, (error) => {
      console.log("error file transfer");

    });

  }

  dismiss() {
    this.modalController.dismiss();
  }

  getSettings() {
    this.settings = this.settingsService.loadSettings();
  }
}
