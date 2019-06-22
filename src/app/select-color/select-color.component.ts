import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

import { COLORS } from '../mocks/mock.colors';


@Component({
  selector: 'app-color-icon',
  templateUrl: './select-color.component.html',
  styleUrls: ['./select-color.component.scss']
})
export class SelectColorComponent implements OnInit {

  colors = COLORS;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }
  
  select(color: string){
    this.popoverController.dismiss(color);
  }

}
