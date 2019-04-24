import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group';
import { ActionService } from '../services/action.service';
import { Action } from '../models/action';

import { Storage } from '@ionic/storage';
import { ModalController, AlertController, ToastController,IonSlides } from '@ionic/angular';
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
             public toastController: ToastController) {}

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
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.refreshAll();
    }
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
    this.pushGroupPage(item as Group, this.categories[+this.tabs].id); //  this.categorySelected.id
  } else if(type instanceof Action){
    this.pushActionPage(item as Action, this.categories[+this.tabs].id);
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
        this.showTour();
        
        // move to mocks or service for create default
        const categoryPeople = new Category();
        categoryPeople.id = 1;
        categoryPeople.name = "Personas";
        categoryPeople.icon = "people";

        const groupFamily = new Group();
        groupFamily.id = 1;
        groupFamily.categoryId = categoryPeople.id;
        groupFamily.name = "Familia";
        groupFamily.sequence = undefined; // support version legacy
        groupFamily.icon = "contacts";

        const groupFriends = new Group();
        groupFriends.id = 2;
        groupFriends.categoryId = categoryPeople.id;
        groupFriends.name = "Amigos";
        groupFriends.sequence = undefined; // support version legacy
        groupFriends.icon = "person";

        const action1 = new Action();
        action1.id = 1;
        action1.categoryId = categoryPeople.id;
        action1.name = "Papa";
        action1.sequence = undefined; // support version legacy
        action1.path='./assets/images/father-example.png' // image default

        const action2 = new Action();
        action2.id = 2;
        action2.categoryId = categoryPeople.id;
        action2.name = "Mama";
        action2.sequence = undefined; // support version legacy
        action2.path='./assets/images/mother-example.png' // image default

        const action3 = new Action();
        action3.id = 3;
        action3.categoryId = categoryPeople.id;
        action3.name = "Mi amigo";
        action3.sequence = undefined; // support version legacy
        action3.path='./assets/images/friend-example.png' // image default
        
        const categoryActivities = new Category();
        categoryActivities.id = 2;
        categoryActivities.name = "Actividades";
        categoryActivities.icon = "bicycle";

        const action4 = new Action();
        action4.id = 4;
        action4.categoryId = categoryActivities.id;
        action4.name = "Andar en bicicleta";
        action4.sequence = undefined; // support version legacy
        action4.path='./assets/images/exercise-bicycle-example.png' // image default

        let categories : Category[] = [];
        categories.push(categoryPeople,categoryActivities);

        let groups : Group[] = [];
        groups.push(groupFamily,groupFriends);

        let actions : Action[] = [];
        actions.push(action1,action2,action3,action4);
    
        // relationships
        const actiongroup1 = new ActionGroup();
        actiongroup1.idAction = action1.id;
        actiongroup1.idGroup = groupFamily.id;

        const actiongroup2 = new ActionGroup();
        actiongroup2.idAction = action2.id;
        actiongroup2.idGroup = groupFamily.id;

        const actiongroup3 = new ActionGroup();
        actiongroup3.idAction = action3.id;
        actiongroup3.idGroup = groupFriends.id;
        
        let actionsGroups : ActionGroup[] = [];
        actionsGroups.push(actiongroup1);
        actionsGroups.push(actiongroup2);
        actionsGroups.push(actiongroup3);

        this.categoryService.saveCategories(categories);
        this.groupService.saveGroups(groups);
        this.actionService.saveActions(actions);
        this.actionGroupService.saveActionGroups(actionsGroups);

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
    
    
    //TODO: ver mejorrr
    //reflection 
    refreshAll(){
      //reflection
      this.getCategories();
      // TODO: ver de hacer que refresque mejor por el cambio de id
      // necesario
      if(this.categories[0]){
        this.categories[0] = this.categories.find(x => x.id == this.categories[0].id)
      }
      this.categories = this.categories;
    }
 
}
