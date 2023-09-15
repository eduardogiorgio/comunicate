import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular'
import { ActionGroup } from '../models/action-group';
import { Group } from '../models/group';
import { Action } from '../models/action';


@Injectable({
  providedIn: 'root'
})
export class ActionGroupService {

  // saves localstorage
  ACTIONSGROUPS = 'actiongroups';

  constructor(private storage: Storage) {}

  loadActionGroups(): ActionGroup[] {
    const stringSettings = localStorage.getItem(this.ACTIONSGROUPS);
    if (stringSettings) {
      const actionGroups = JSON.parse(stringSettings) as ActionGroup[];
      return actionGroups;
    } else {
      const actionGroups =  [];
      this.saveActionGroups(actionGroups);

      return actionGroups;
    }

  }

  getGroupsByAction(actionId: number) {
    const actionGroups = this.loadActionGroups().filter(x => x.idAction === actionId);
    return actionGroups;
    // this.groupsSelected = this.groups.filter(x => actionGroups.findIndex(y => y.idGroup === x.id) > 0 );
  }

  getActionByGroup(groupId: number) {
    const actionGroups = this.loadActionGroups().filter(x => x.idGroup === groupId);
    return actionGroups;
    // this.actionsSelected = this.action.filter(x => actionGroups.findIndex(y => y.idAction === x.id) > 0 );
  }

  getActionByGroups(groups: Group[]) {
    const actionGroups = this.loadActionGroups().filter(x => groups.some(y => y.id === x.idGroup)  );
    return actionGroups;
    // this.actionsSelected = this.action.filter(x => actionGroups.findIndex(y => y.idAction === x.id) > 0 );
  }

  saveGroupWithActions(group: Group, actions: Action[]) {

    // obtengo
    // quito de la lista lo que no van
    // agrego los nuevos
    const allactiongroups = this.loadActionGroups();
    const actionGroups = allactiongroups.filter(x => x.idGroup !== group.id);
    actions.forEach(x => actionGroups.push({idAction: x.id, idGroup: group.id}));

    this.saveActionGroups(actionGroups);

  }

  saveActionWithGroups(action: Action, groups: Group[]) {

    // obtengo
    // quito de la lista lo que no van
    // agrego los nuevos
    const allactiongroups = this.loadActionGroups();
    const actionGroups = allactiongroups.filter(x => x.idAction !== action.id);
    groups.forEach(group => actionGroups.push({idAction: action.id, idGroup: group.id}));

    this.saveActionGroups(actionGroups);

  }

  saveActionGroups(actionGroups: ActionGroup[]) {
    localStorage.setItem(this.ACTIONSGROUPS, JSON.stringify(actionGroups));
  }
}
