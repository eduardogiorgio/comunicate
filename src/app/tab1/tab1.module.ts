import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ActionsByGroupPipe } from '../pipes/actions-pipe';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]), // :id
    SuperTabsModule.forRoot()    
  ],
  providers: [ActionsByGroupPipe],
  declarations: [Tab1Page, ActionsByGroupPipe,CategoryDetailComponent]
})
export class Tab1PageModule {}
