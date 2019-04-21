import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Category } from '../models/category';

import { GroupService } from '../services/group.service';
import { ActionGroupService } from '../services/action-group.service';
import { ActionService } from '../services/action.service';
import { SettingsService } from '../services/settings.service';
import { Group } from '../models/group';
import { Action } from '../models/action';
import { ActionGroup } from '../models/action-group';
import { NoSelected } from '../models/no-selected';
import { Settings } from '../models/settings';
import { TextToSpeech, TTSOptions } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  
  
  noSelected: NoSelected;
  
  @Input() category: Category;
  @Input() settings: Settings;
  @Input() latestSelected: Category | Group | Action | NoSelected;
  @Output() latestSelectedChange = new EventEmitter<Category | Group | Action | NoSelected>();
  // falta un inputoutput para el seleccionado lo puedan compartir edicion y borrar
  @Output() callEditing = new EventEmitter<Category | Group | Action | NoSelected>();
  
  
  groupsSelected: Group[] = [];
  actionSelected : Action;

  groups: Group[];
  actions: Action[];
  
  actionGroups: ActionGroup[];

  constructor(private groupService: GroupService, 
    private actionGroupService: ActionGroupService,
    private actionService: ActionService,
    private tts: TextToSpeech,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.getActions();
    this.getGroups();
  }

  // groups
  getGroups() {
   this.groups = this.groupService.loadGroupsByCategory(this.category.id);
  }

  getActions() {
    this.actions = this.actionService.loadActionsByCategory(this.category.id);
  }
  
  // ver que el latest selected este en las configuraciones
  //TODO: VER herencia para no repetir las acciones
  unselectedItem(item : Category | Group | Action | NoSelected){
    if(!this.settings.editMode) return;
    setTimeout(()=>{
      this.latestSelected = this.latestSelected == item ? this.noSelected : item;
      this.latestSelectedChange.emit(this.latestSelected);
    },100);
  }
  
  // unselectedItem tiene su propia logica particular
  groupChanged(group : Group) {
    // agrega o quita de la lista
    const existGroup =  this.groupsSelected.indexOf(group) > -1;
    if(existGroup){
      this.groupsSelected = this.groupsSelected.filter(x => x.id != group.id);
      if(group === this.latestSelected){
        this.unselectedItem(group)  
      }
    } else{
      this.groupsSelected.push(group);
      this.unselectedItem(group)
    }
    if( this.groupsSelected.length > 0){
      this.actionGroups = this.actionGroupService.getActionByGroups(this.groupsSelected);
    } else {
      this.actionGroups = undefined; // no filtre
    }
    
  }
  
  groupedsSelected(group): boolean {
    return (this.groupsSelected.indexOf(group) > -1);
  }

  editItem(item : Category | Group | Action){
    this.callEditing.emit(item);
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

    selectedAction(action: Action){
      this.actionSelected = action;
      this.speechText(this.actionSelected.name);
    }
}
