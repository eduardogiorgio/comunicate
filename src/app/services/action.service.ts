import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Action } from '../models/action';


@Injectable({
  providedIn: 'root'
})
export class ActionService {

  // saves localstorage
  ACTIONS = 'actions';

  constructor(private storage: Storage) {}

  loadActions() : Action[] {
    const stringSettings = localStorage.getItem(this.ACTIONS);
    if (stringSettings) {
      const actions = JSON.parse(stringSettings) as Action[];
      return actions;
    } else {
      const actions =  [];
      this.saveActions(actions);

      return actions;
    }

  }

  loadActionsByCategory(categoryId: number): Action[] {
    return this.loadActions().filter(x => x.categoryId === categoryId);
  }

  save(action: Action, order: number) {
    const actions = this.loadActions();
    const i = actions.findIndex(x => x.id === action.id);
    // funciona pero no se porque
    var sumar = actions.findIndex(x => x.categoryId == action.categoryId); 
    const posicion = order + sumar;
    
    if (i < 0 ) {
      actions.splice(posicion, 0, action);
    } else {
      if (i ===  posicion) {
        actions[i] = action;
      } else {
        actions.splice(i, 1);
        actions.splice(posicion, 0, action);
      }
    }
    localStorage.setItem(this.ACTIONS, JSON.stringify(actions));
  }

  delete(action: Action) {
    const actions = this.loadActions();
    const i = actions.findIndex(x => x.id === action.id);
    if (i >= 0 ) {
      actions.splice(i, 1);
    }
    // busco la categoria al que pertenece
    this.saveActions(actions);
  }

  deleteActionsByCategory(idCategory: number) {
    const actions = this.loadActions();
    const i = actions.filter(x => x.categoryId !== idCategory);

    this.saveActions(actions);
  }

  saveActions(actions: Action[]) {
    localStorage.setItem(this.ACTIONS, JSON.stringify(actions));
  }
}
