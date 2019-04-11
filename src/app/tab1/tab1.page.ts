import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group';
import { ActionService } from '../services/action.service';
import { Action } from '../models/action';

import { Storage } from '@ionic/storage';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ActionEditComponent } from '../action-edit/action-edit.component';
import { GroupEditComponent } from '../group-edit/group-edit.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { TextToSpeech, TTSOptions } from '@ionic-native/text-to-speech/ngx';
import { SettingsComponent } from '../settings/settings.component';
import { Settings } from '../models/settings';
import { SettingsService } from '../services/settings.service';
import { ActionGroupService } from '../services/action-group.service';
import { ActionGroup } from '../models/action-group';
import { NoSelected } from '../models/no-selected';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
 constructor(private route: ActivatedRoute, private tts: TextToSpeech, private categoryService: CategoryService,
             private groupService: GroupService, private actionGroupService: ActionGroupService,
             private actionService: ActionService, private settingsService: SettingsService,
             private storage: Storage, private modalController: ModalController,
             private alertController: AlertController,public toastController: ToastController) {}

  settings: Settings;
  categories: Category[];
  //groups: Group[];
  //actions: Action[];
  //actionGroups: ActionGroup[];

  latestSelected: Category | Group | Action | NoSelected;
  categorySelected: Category;
  noSelected: NoSelected;

  ngOnInit(): void {
    this.latestSelected = this.noSelected;
    this.getCategories();
    this.getSettings();
  }

  getCategories() {
    this.categories = this.categoryService.loadCategories();
  }

  addCategory() {
      this.pushCategoryPage(null);
  }

   async pushCategoryPage(category?: Category) {
     const modal = await this.modalController.create({
      component: CategoryEditComponent,
      componentProps: {
        'category': category,
      }

    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.getCategories();
      this.categorySelected = this.categories.find( x => x.id == data.id);
      //this.categoryChanged(this.categorySelected);
      // TODO: ver de hacer que refresque mejor por el cambio de id
      this.categories = this.categories; // detect reflection 
    }
  }

  getCategory(idCategory: number) {
    this.categorySelected = this.categoryService.loadCategories().find(x => x.id ===  this.categorySelected.id);
  }


  addGroup() {
    this.pushGroupPage(null, this.categorySelected.id);
  }

 async pushGroupPage(group?: Group, categoryId?: number) {
   const modal = await this.modalController.create({
    component: GroupEditComponent,
    componentProps: {
      'group': group,
      'categoryId' : categoryId
    }

   });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      //TODO: call refresh or not
      //this.getGroups(this.categorySelected.id);
      //this.getGroups(this.categorySelected.id);
      //this.groupSelected = this.groups.find( x => x.id == data.id);
      //this.groupChanged();
    }
  }

addAction() {
  this.pushActionPage(null, this.categorySelected.id);
}
/*
deleteAction() {
  
  this.actionSelected = null;
  //this.getActions(this.categorySelected.id);
}
*/

async pushActionPage(action?: Action, categoryId?: number) {
 const modal = await this.modalController.create({
  component: ActionEditComponent,
  componentProps: {
    'action': action,
    'categoryId' : categoryId
  }

 });
  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data) {
    /*
    this.getActions(this.categorySelected.id);
    // si no esta en la misma categoria
    if(data.categoryId == this.categorySelected.id){
      this.actionSelected = this.actions.find( x => x.id == data.id);
      this.actionChanged(this.actionSelected);
    } else if(data.id == this.actionSelected.id){ // si se edito y cambio de cateogira
      this.actionSelected = null;
      this.latestSelected = NoSelected;
    }
    */
  }
}

categoryChangedIndex(index: any){
  this.categorySelected = this.categories[index.detail];
  this.latestSelected = this.categorySelected;
}

latestSelectedChange(latestSelected: Category | Group | Action | NoSelected){
  if(this.latestSelected == latestSelected){
    this.latestSelected = this.noSelected
  } else{
    this.latestSelected = latestSelected
  }
}


detectedType (latestSelected : Category | Group | Action | NoSelected) : Category | Group | Action | NoSelected {
  if(!('id' in latestSelected))
    return new NoSelected();
  if(!('categoryId' in latestSelected))
    return new Category();
  if(!('path' in latestSelected))
    return new Group();
  if(!('icon' in latestSelected))
    return new Action();
}

// ver de mejorar y hacer factory
editItem(item : Category | Group | Action | NoSelected) {

  if(!this.settings.editMode) return;
  const type = this.detectedType(item);
  
  if(type instanceof Category){
    this.pushCategoryPage(item as Category);
  } else if(type instanceof Group){
    this.pushGroupPage(item as Group, this.categorySelected.id);
  } else if(type instanceof Action){
    this.pushActionPage(item as Action, this.categorySelected.id);
  }
  
}

deleteItem(item : Category | Group | Action | NoSelected) {
  const type = this.detectedType(item);
  
  if(type instanceof Category){
    this.categoryService.delete(item as Category);
    this.groupService.deleteGroupsByCategory((item as Category).id);
    this.actionService.deleteActionsByCategory((item as Category).id);
    this.getCategories();
  } else if(type instanceof Group){
    this.groupService.delete(item as Group);
    this.actionGroupService.saveGroupWithActions(item as Group, []);
  } else if(type instanceof Action){
    this.actionService.delete(item as Action);
    this.actionGroupService.saveActionWithGroups(item as Action, []);
  }
  this.latestSelected = this.noSelected;
}

unselectedItem(item : Category | Group | Action | NoSelected){
  if(!this.settings.editMode) return;
  setTimeout(()=>{
    this.latestSelected = this.latestSelected == item ? this.noSelected : item;
  },100);
}

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

  async pushSettingsPage() {
    const modal = await this.modalController.create({
     component: SettingsComponent,
     componentProps: {}
    });
     await modal.present();
     await modal.onDidDismiss();
     this.getSettings();
   }

   getSettings() {
     this.settings = this.settingsService.loadSettings();
   }

   lock() {
    this.settings.editMode = false;
    this.settingsService.saveSettings(this.settings);
   }

   unLock(){
    this.settings.editMode = true;
    this.settingsService.saveSettings(this.settings);
   }

   checkAndUnLock() {
      // validate
      if(this.settings.pattern == 2){
         this.unlockByText();

      } else{
        this.unLock();
    }
   }

    async unlockByText() {
      // crear la rgla
      // un component distinto
      //const alertController = document.querySelector('ion-alert-controller');
      //await alertController.componentOnReady();
    
      const alert = await this.alertController.create({
        header: 'Ingrese contraseña',
        inputs: [
          {
            name: 'password',
            type: 'text',
            placeholder: 'Contraseña',
            
          }],
          
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Desbloquear',
              handler: (data) => {
                if(this.settings.patternPassword == data.password ){
                  this.unLock();
                } else{
                  this.presentToastErrorPassword();
                }
              }
            }
          ]
      });
      return await alert.present();
    }

    async presentToastErrorPassword() {
      const toast = await this.toastController.create({
        message: 'Contraseña incorrecta',
        showCloseButton: true,
        position: 'top',
        closeButtonText: 'Done'
      });
      toast.present();
    }
    
}
