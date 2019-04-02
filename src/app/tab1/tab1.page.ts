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
  groups: Group[];
  actions: Action[];
  actionGroups: ActionGroup[];

  latestSelected: string;
  categorySelected: Category;
  groupSelected: Group;
  actionSelected: Action;

  ngOnInit(): void {
    this.getCategories();
    this.getSettings();
  }

  getCategories() {
    this.categories = this.categoryService.loadCategories();
  }

  addCategory() {
      this.pushCategoryPage(null);
  }

  editCategory() {
    this.pushCategoryPage(this.categorySelected);
  }

  deleteCategory() {
    this.categoryService.delete(this.categorySelected);
    this.groupService.deleteGroupsByCategory(this.categorySelected.id);
    this.actionService.deleteActionsByCategory(this.categorySelected.id);
    this.categorySelected = null;
    this.getCategories();
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
    }
  }

  getCategory(idCategory: number) {
    this.categorySelected = this.categoryService.loadCategories().find(x => x.id ===  this.categorySelected.id);
  }


  // groups
  getGroups(idCategory: number) {
    this.groups = this.groupService.loadGroupsByCategory(this.categorySelected.id);
  }

  addGroup() {
    this.pushGroupPage(null, this.categorySelected.id);
  }

  editGroup() {
    this.pushGroupPage(this.groupSelected, this.categorySelected.id);
  }

  deleteGroup() {
    this.groupService.delete(this.groupSelected);
    this.actionGroupService.saveGroupWithActions(this.groupSelected, []);
    this.groupSelected = null;
    this.actionGroups = null;
    this.getGroups(this.categorySelected.id);
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
      this.getGroups(this.categorySelected.id);
    }
  }

// actions
getActions(idCategory: number) {
  this.actions = this.actionService.loadActionsByCategory(this.categorySelected.id);
}

addAction() {
  this.pushActionPage(null, this.categorySelected.id);
}

editAction() {
  this.pushActionPage(this.actionSelected, this.categorySelected.id);
}

deleteAction() {
  this.actionService.delete(this.actionSelected);
  this.actionGroupService.saveActionWithGroups(this.actionSelected, []);
  this.actionSelected = null;
  this.getActions(this.categorySelected.id);
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
    this.getActions(this.categorySelected.id);
  }
}

categoryChanged() {
  this.loadLatestSelected('category');
  if (this.categorySelected) {
    this.groupSelected = null;
    this.actionGroups = null;
    this.getGroups(this.categorySelected.id);
    this.getActions(this.categorySelected.id);
  }
}

groupChanged() {
  this.loadLatestSelected('group');
  // obtener el datos de los groups.
  this.actionGroups = this.actionGroupService.getActionByGroup(this.groupSelected.id);
}

actionChanged(action: Action) {
  this.actionSelected = action;
  this.loadLatestSelected('action');
  this.speechText(this.actionSelected.name);
}

// pattern staegy
loadLatestSelected(latestSelected: string) {
  this.latestSelected = latestSelected;
}

// ver de mejorar y hacer factory
editItem() {
  switch (this.latestSelected) {
    case 'category':
      this.editCategory();
      break;
    case 'group':
      this.editGroup();
      break;
    case 'action':
      this.editAction();
      break;
    default:
      break;
  }
}

deleteItem() {
  // check tipe latest
  switch (this.latestSelected) {
    case 'category':
      this.deleteCategory();
      break;
      case 'group':
      this.deleteGroup();
      break;
      case 'action':
      this.deleteAction();
      break;
    default:
      console.log('error'); // no deberia ocurrir por el ngif
      break;
  }

  this.latestSelected = '';
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
