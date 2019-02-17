import { Pipe, PipeTransform } from '@angular/core';
import { Action } from '../models/action';
import { Group } from '../models/group';
import { ActionGroup } from '../models/action-group';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'actionsByGroup'})
export class ActionsByGroupPipe implements PipeTransform {
  transform(actions: Action[], actionGrups: ActionGroup[]): Action[] {
      if (!actionGrups) {
          return actions;
      }

      return actions.filter(x => actionGrups.findIndex(y => y.idAction === x.id) > -1) ;
  }
}
