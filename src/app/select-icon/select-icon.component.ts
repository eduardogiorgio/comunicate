import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICONS } from '../mocks/mock.icons';


@Component({
  selector: 'app-select-icon',
  templateUrl: './select-icon.component.html',
  styleUrls: ['./select-icon.component.scss']
})
export class SelectIconComponent implements OnInit {

  icons = ICONS;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  
  select(icon: string){
    this.modalController.dismiss(icon);
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
