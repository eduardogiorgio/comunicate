import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Action } from '../models/action';
import { ActionService } from '../services/action.service';
import { GroupService } from '../services/group.service';
import { CategoryService } from '../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';


import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { PhotoLibrary, LibraryItem } from '@ionic-native/photo-library/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { TextToSpeech, TTSOptions } from '@ionic-native/text-to-speech/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings';
import { Category } from '../models/category';
import { Group } from '../models/group';
import { ImageListComponent } from '../image-list/image-list.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss']
})
export class ActionEditComponent implements OnInit {
  environment = environment;
  
  categories: Category[];
  groups: Group[];
  groupsSelected: Group[];
  actions: Action[];

  order: number;
  settings: Settings;
  actionform: FormGroup;
  @Input() action?: Action;
  @Input() categoryId?: number;

  constructor(private camera: Camera,
              private crop: Crop,
              private tts: TextToSpeech,
              private modalController: ModalController,
              private alertController: AlertController,
              private actionService: ActionService,
              private groupService: GroupService,
              private categoryService: CategoryService,
              private settingsService: SettingsService,
              private photoLibrary: PhotoLibrary,
              private webView: WebView,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCategories();
    // if not passing using first :)
    if(!this.categoryId){
      this.categoryId = this.categories[0].id;
    }
    this.getGroupsByCategory(this.categoryId);
    this.getActionsByCategory(this.categoryId);
    this.getSettings();

    this.initializateAction();
    this.initializateValidators();
  }

  getCategories() {
    this.categories = this.categoryService.loadCategories();
  }

  getGroupsByCategory(categoryId: number) {
    this.groups = this.groupService.loadGroupsByCategory(categoryId);
  }

  getActionsByCategory(categoryId: number) {
    this.actions = this.actionService.loadActionsByCategory(categoryId);
  }

  initializateValidators() {
    this.actionform = new FormGroup({
      name: new FormControl(this.action.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      category: new FormControl(this.action.categoryId, [Validators.required]),
      path: new FormControl(this.action.path),
      group: new FormControl(this.groupsSelected),
      order: new FormControl(this.order),
   });
  }

  initializateAction() {
    if (!this.action && this.categoryId) {
      this.action = new Action();
      this.action.id = new Date().valueOf(); // genera el id unico;
      this.action.name = ''; // multiidioma
      this.action.path = environment.FOTO_IMAGE_DEFAULT; // default
      this.action.categoryId = this.categoryId;
      this.order = this.actions.length;
    } else {
      this.order = this.actions.findIndex(x => x.id === this.action.id);
    }

    this.addFirstFinalOrden(this.categoryId);
  }

  addFirstFinalOrden(categoryId: number) {
    const actionFinal: Action = { id: 0, name: 'final', categoryId: categoryId, path: '', sequence: this.actions.length };

    if (this.order === this.actions.length) {
      this.actions.push(actionFinal);
    } else {
      this.actions[this.actions.length - 1 ] = actionFinal;
    }

  }

  async takePhoto() {
    const alert = await this.alertController.create({
      header: 'Alert',
      buttons: [
        { text: 'Elegir una existe',
          handler: (blah) => {
            this.takePhotoWithSourceType(PictureSourceType.PHOTOLIBRARY);
          }
        },
        { text: 'Tomar Foto',
          handler: (blah) => {
            this.takePhotoWithSourceType(PictureSourceType.CAMERA);
          }
        },
        { text: 'Buscar internet',
          handler: (blah) => {
            this.takePhotoPixabay();
          }
        }
        ]
    });

    await alert.present();
  }

  takePhotoWithSourceType(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    };


    // funciona para las fotos nomas
    this.camera.getPicture(options).then((imageData) => {
        this.cropImage(imageData);
    }, (err) => {
    });

  }

  cropImage(imageData: any){
    this.crop.crop(imageData, {quality: 100})
    .then(
      newImage => {
        newImage = newImage.slice(0, newImage.lastIndexOf('?'));
        // remueve lo ultimo
        this.photoLibrary.saveImage(newImage, 'comunicate')
        .then((liberyItem: LibraryItem) => {
          const path = 'file://' + liberyItem.id.split(';')[1];
          const pathConvert = this.webView.convertFileSrc(path ); 
          //this.actionform.value.path =  pathConvert;
          this.actionform.controls["path"].setValue(pathConvert);
          this.ref.detectChanges(); // reflection :)
          
        })
        .catch((erro) => {
          console.log(erro);
        });
      },
      error => console.error('Error cropping image', error)
    );
  }


  speechAction() {
    this.speechText(this.actionform.get('name').value);
  }

  // refactorizar y poner en un servicio lo utiliza en varios lugares
  speechText(text: string) {
    const ttsOptions: TTSOptions = {
       text: text,
       rate: this.settings.rateSpeek, // poder usar el del tablet
       locale: this.settings.localeSpeek
      };

      this.tts.speak(ttsOptions)
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
    }


  onSubmit() {
    const action = new Action();
    action.id = this.action.id;
    action.name = this.actionform.get('name').value;
    action.path = this.actionform.value.path;
    action.sequence = this.action.sequence;
    action.categoryId = this.actionform.get('category').value;
    const order = this.actionform.get('order').value;

    this.actionService.save(action, order);
    this.modalController.dismiss(action);

  }

  dismiss() {
    this.modalController.dismiss();
  }

  getSettings() {
    this.settings = this.settingsService.loadSettings();
  }

  categoryChanged() {
    const value = this.actionform.get('category').value;
    this.getGroupsByCategory(value);
    this.getActionsByCategory(value);
    
    const actionFinal: Action = { id: 0, name: 'final', categoryId: value, path: '', sequence: this.actions.length };
    this.actions.push(actionFinal);
  }

  async takePhotoPixabay(){
    const modal = await this.modalController.create({
      component: ImageListComponent,
      componentProps: {}
     });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data) {
          this.cropImage(data);
      }

      this.getSettings();
  }

}
