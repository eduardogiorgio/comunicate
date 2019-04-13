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
  
  
  groupSelected: Group;
  groups: Group[];
  actions: Action[];
  
  actionGroups: ActionGroup[];

  constructor(private groupService: GroupService, 
    private actionGroupService: ActionGroupService,
    private actionService: ActionService,
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
    console.log(item);
    if(!this.settings.editMode) return;
    setTimeout(()=>{
      this.latestSelected = this.latestSelected == item ? this.noSelected : item;
      this.latestSelectedChange.emit(this.latestSelected);
    },100);
  }
  
  groupChanged() {
    // si los elimina no cambia nada
    if (this.groupSelected) {
      this.latestSelected =  this.groupSelected;
      this.actionGroups = this.actionGroupService.getActionByGroup(this.groupSelected.id);
    }
  }

  editItem(item : Category | Group | Action){
    this.callEditing.emit(item);
  }
}
