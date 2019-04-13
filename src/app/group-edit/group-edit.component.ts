import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Group } from '../models/group';
import { GroupService } from '../services/group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActionService } from '../services/action.service';
import { Action } from '../models/action';
import { ActionGroupService } from '../services/action-group.service';
import { ICONS } from '../mocks/mock.icons';
import { SelectIconComponent } from '../select-icon/select-icon.component';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {

  order: number;
  actions: Action[];
  actionsSelected: Action[];
  groups: Group[];
  groupform: FormGroup;
  @Input() group?: Group;
  @Input() categoryId?: number;

  icons = ICONS;
  constructor(private modalController: ModalController,
              private groupService: GroupService,
              private actionGroupService: ActionGroupService,
              private actionService: ActionService,
              ) { }

  ngOnInit() {
    this.getGroups();
    this.getActionsByCategory();
    this.initializateGroup();
    this.getActionByGroup();
    this.initializateValidators();
  }

  // ver si utilizar un filtro es mas sencillo
  getGroups() {
    this.groups = this.groupService.loadGroupsByCategory(this.categoryId);
  }


  getActionsByCategory() {
    this.actions = this.actionService.loadActionsByCategory(this.categoryId);
  }

  getActionByGroup() {
    const actionGroups = this.actionGroupService.getActionByGroup(this.group.id);
    this.actionsSelected = this.actions.filter(x => actionGroups.findIndex(y => y.idAction === x.id) > -1 );
  }

  initializateValidators() {
    this.groupform = new FormGroup({
      name: new FormControl(this.group.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      icon: new FormControl(this.group.icon, Validators.required),
      order: new FormControl(this.order, Validators.required),
      actions: new FormControl(this.actionsSelected),
   });
  }

  async pushIconPage() {
    const modal = await this.modalController.create({
     component: SelectIconComponent
   });
   await modal.present();
   const { data } = await modal.onDidDismiss();
   if (data) {
     this.groupform.controls.icon.setValue(data);
   }
 }

  initializateGroup() {
    if (!this.group && this.categoryId) {
      this.group = new Group();
      this.group.id = new Date().valueOf(); // genera el id unico
      this.group.name = 'My new Group';
      this.group.icon = 'add-circle';
      this.group.categoryId = this.categoryId;
      this.order = this.groups.length;
    } else {
      this.order = this.groups.findIndex(x => x.id === this.group.id);
    }
    this.addFirstFinalOrden(this.categoryId);
  }

  addFirstFinalOrden(categoryId: number) {
    const groupFinal: Group = { id: 0, name: 'final', categoryId: categoryId, icon: 'add-circle' , sequence: this.actions.length };

    if (this.order === this.groups.length) {
      this.groups.push(groupFinal);
    } else {
      this.groups[this.groups.length - 1 ] = groupFinal;
    }

  }

  onSubmit() {
    const group = new Group();
    group.id = this.group.id;
    group.name = this.groupform.get('name').value;
    group.icon = this.groupform.get('icon').value;
    group.categoryId = this.group.categoryId;
    const order = this.groupform.get('order').value;
    const actionsSelected = this.groupform.get('actions').value;

    this.groupService.save(group, order);
    this.actionGroupService.saveGroupWithActions(group, actionsSelected);

    this.modalController.dismiss(group);

  }

  dismiss() {
    this.modalController.dismiss();
  }

}
