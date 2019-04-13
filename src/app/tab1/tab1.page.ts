import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { SuperTabs } from '@ionic-super-tabs/angular';


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
  
  latestSelected: Category | Group | Action | NoSelected;
  //categorySelected: Category;
  noSelected: NoSelected;

  // get current tab
  @ViewChild(SuperTabs) tabs: SuperTabs;

  ngOnInit(): void {
    this.latestSelected = this.noSelected;
    this.getCategories();
    //this.categorySelected = this.categories[0];
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
      this.refreshAll();
    }
  }

  addGroup() {
    this.pushGroupPage(null, this.categories[this.tabs.activeTabIndex].id);
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
      this.refreshAll();
    }
  }

addAction() {
  this.pushActionPage(null, this.categories[this.tabs.activeTabIndex].id);
}

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
      this.refreshAll();
  }
}

// si esta seleccionado cuando cmabia de cateoria selecciona otro
categoryChangedIndex(index: any){
   //TODO: problem autoselect
  // change detected if type equals category
  if(this.detectedType(this.latestSelected) instanceof Category){
    this.latestSelected = this.categories[index.detail];
  }
}


latestSelectedChange(latestSelected: Category | Group | Action | NoSelected){
  if(this.latestSelected == latestSelected){
    this.latestSelected = this.noSelected
  } else{
    this.latestSelected = latestSelected
  }
}


detectedType (latestSelected : Category | Group | Action | NoSelected) : Category | Group | Action | NoSelected {
  if(!latestSelected)
    return new NoSelected();
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
  this.latestSelected = item;
  if(!this.settings.editMode) return;
  const type = this.detectedType(item);
  
  if(type instanceof Category){
    this.pushCategoryPage(item as Category);
  } else if(type instanceof Group){
    this.pushGroupPage(item as Group, this.categories[this.tabs.activeTabIndex].id); //  this.categorySelected.id
  } else if(type instanceof Action){
    this.pushActionPage(item as Action, this.categories[this.tabs.activeTabIndex].id);
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
 //reflection
  if(type instanceof Category || type instanceof Group || type instanceof Action){
    this.refreshAll();
  }

  this.latestSelected = this.noSelected;
}

// ver que el latest selected este en las configuraciones
//TODO: VER herencia para no repetir las acciones
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
    
    
    //TODO: ver mejorrr
    //reflection 
    refreshAll(){
      //reflection
      this.getCategories();
      // TODO: ver de hacer que refresque mejor por el cambio de id
      // necesario
      this.categories[0] = this.categories.find(x => x.id == this.categories[0].id)
      this.categories = this.categories;
    }
 
}
