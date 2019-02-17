import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ActionsByGroupPipe } from '../pipes/actions-pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]) // :id
  ],
  providers: [ActionsByGroupPipe],
  declarations: [Tab1Page, ActionsByGroupPipe]
})
export class Tab1PageModule {}
