import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group';
import { ActionService } from '../services/action.service';
import { Action } from '../models/action';

import { Storage } from '@ionic/storage';
import { ModalController, AlertController, ToastController,IonSlides, NavController } from '@ionic/angular';
import { ActionEditComponent } from '../action-edit/action-edit.component';
import { GroupEditComponent } from '../group-edit/group-edit.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { SettingsComponent } from '../settings/settings.component';
import { Settings } from '../models/settings';
import { SettingsService } from '../services/settings.service';
import { ActionGroupService } from '../services/action-group.service';
import { NoSelected } from '../models/no-selected';
import { TourComponent } from '../tour/tour.component';
import { ActionGroup } from '../models/action-group';
import { CATEGORIES } from '../mocks/mock.categories';
import { GROUPS } from '../mocks/mock.groups';
import { ACTIONS } from '../mocks/mock.actions';
import { ACTIONSGROUPS } from '../mocks/mock.actionsgroups';
import { RestoreData } from '../models/restore-data';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
 constructor(private categoryService: CategoryService,
             private groupService: GroupService, private actionGroupService: ActionGroupService,
             private actionService: ActionService, private settingsService: SettingsService,
             private modalController: ModalController, private alertController: AlertController,
             public toastController: ToastController,private ref: ChangeDetectorRef) {}

             @ViewChild('rootNavController') nav: NavController;
  settings: Settings;
  categories: Category[];
  
  latestSelected: Category | Group | Action | NoSelected;
  noSelected: NoSelected;

  
  @ViewChild('pageSlider') pageSlider: IonSlides;
  tabs: string = "0";
  selectTab(index) {
    this.pageSlider.slideTo(index);
  }
  changeWillSlide() {
    this.pageSlider.getActiveIndex().then(x => {
      this.tabs = x.toString();
    });
   }

   // ver de hacer que no modifique el lugar del ion slider
   centerSegment(event: any){
      console.log(event);
      //event.srcElement.scrollIntoView(false);
      // center alingh :)
      event.srcElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    });
   }


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

    this.finishPage(modal);
  }

  addGroup() {
    this.pushGroupPage(null, this.categories[+this.tabs].id);
  }

 async pushGroupPage(group?: Group, categoryId?: number) {
   const modal = await this.modalController.create({
    component: GroupEditComponent,
    componentProps: {
      'group': group,
      'categoryId' : categoryId
    }

   });

   this.finishPage(modal);
  }

addAction() {
  this.pushActionPage(null, this.categories[+this.tabs].id);
}

async pushActionPage(action?: Action, categoryId?: number) {
 const modal = await this.modalController.create({
  component: ActionEditComponent,
  componentProps: {
    'action': action,
    'categoryId' : categoryId
  }
 });

 this.finishPage(modal);

}

async finishPage(modal: HTMLIonModalElement){
  // deberia hacer contramovimiento pero sino es muy pesado
  const restoreData = this.generateRestoreData()

  // recontrullo todo el estado anterior es mas facil que hacer las reversas
  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data) {
      this.refreshAll();
      this.presentToastUndoChanges(restoreData);
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
    this.pushGroupPage(item as Group, this.categories[+this.tabs].id); //  this.categorySelected.id
  } else if(type instanceof Action){
    this.pushActionPage(item as Action, this.categories[+this.tabs].id);
  }
  
}

deleteItem(item : Category | Group | Action | NoSelected) {
  const type = this.detectedType(item);
  
  const restoreData = this.generateRestoreData();

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
    this.presentToastUndoChanges(restoreData);
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
     // if first time
     if(this.settings.isMyFirtView){

        const categories = CATEGORIES;
        const groups = GROUPS;
        const actions = ACTIONS;
        const actionsGroups = ACTIONSGROUPS;

        this.categoryService.saveCategories(categories);
        this.groupService.saveGroups(groups);
        this.actionService.saveActions(actions);
        this.actionGroupService.saveActionGroups(actionsGroups);

        this.showTour();
        this.getCategories();
     }
   }

   async showTour() {
    const modal = await this.modalController.create({
     component: TourComponent,
   });
   await modal.present();
   await modal.onDidDismiss();
   this.settings.isMyFirtView = false;
   this.settingsService.saveSettings(this.settings);
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
                //console.log('Confirm Cancel: blah');
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
    
    
    
    refreshAll(){
      //reflection
      this.getCategories();
      // TODO: ver de hacer que refresque mejor por el cambio de id
      // necesario
      //if(this.categories[0]){
      //  this.categories[0] = this.categories.find(x => x.id == this.categories[0].id)
      //}
      //this.categories = this.categories;
      this.ref.detectChanges();
    }
 

    async presentToastUndoChanges(restoreData: RestoreData) {
      const toast = await this.toastController.create({
    
        duration: 2000,
        position: 'bottom',
        buttons: [
          {
            side: 'end',
            icon: 'undo',
            text: 'Desacer',
            handler: () => {
              this.restoreData(restoreData);
            }
          }
        ]
      });
      toast.present();
    }

    generateRestoreData(){
      const restoreData = new RestoreData();
      restoreData.categories = this.categoryService.loadCategories();
      restoreData.groups     = this.groupService.loadGroups();
      restoreData.actions    = this.actionService.loadActions();

      return restoreData;
    }

    restoreData(restoreData : RestoreData){
      console.log(restoreData);
      if(!restoreData)
        return;

      this.categoryService.saveCategories(restoreData.categories);
      this.groupService.saveGroups(restoreData.groups);
      this.actionService.saveActions(restoreData.actions);
      this.refreshAll();
    }
}
