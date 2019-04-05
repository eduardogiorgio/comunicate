import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Group } from '../models/group';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  // saves localstorage
  GROUPS = 'groups';

  constructor(private storage: Storage) {}

  loadGroups() {
    const stringSettings = localStorage.getItem(this.GROUPS);
    if (stringSettings) {
      const groups = JSON.parse(stringSettings) as Group[];
      return groups;
    } else {
      const groups =  [];
      this.saveGroups(groups);

      return groups;
    }

  }

  loadGroupsByCategory(categoryId: number): Group[] {
    return this.loadGroups().filter(x => x.categoryId === categoryId);
  }

  save(group: Group, order: number) {
    const groups = this.loadGroups();
    const i = groups.findIndex(x => x.id === group.id);
    var sumar = groups.findIndex(x => x.categoryId == group.categoryId); 
    const posicion = order + sumar;

    if (i < 0 ) {
      groups.splice(posicion, 0, group);
    } else {
      if (i ===  posicion) {
        groups[i] = group;
      } else {
        groups.splice(i, 1);
        groups.splice(posicion, 0, group);
      }
    }
    localStorage.setItem(this.GROUPS, JSON.stringify(groups));
  }

  delete(group: Group) {
    const groups = this.loadGroups();
    const i = groups.findIndex(x => x.id === group.id);
    if (i >= 0 ) {
      groups.splice(i, 1);
    }
    // busco la categoria al que pertenece
    this.saveGroups(groups);
  }

  deleteGroupsByCategory(idCategory: number) {
    const groups = this.loadGroups();
    const i = groups.filter(x => x.categoryId !== idCategory);

    this.saveGroups(groups);
  }

  saveGroups(groups: Group[]) {
    localStorage.setItem(this.GROUPS, JSON.stringify(groups));
  }
}
