import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { ICONS } from '../mocks/mock.icons';
import { SelectIconComponent } from '../select-icon/select-icon.component';
import { COLORS } from '../mocks/mock.colors';
import { SelectColorComponent } from '../select-color/select-color.component';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  order: number;
  categories: Category[];
  categoryform: FormGroup;
  @Input() category?: Category;

  icons = ICONS;
  colors = COLORS;
  constructor(public popoverController: PopoverController,private modalController: ModalController, private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
    this.initializateCategory();
    this.initializateValidators();
  }

  getCategories() {
    this.categories = this.categoryService.loadCategories();
  }
  initializateValidators() {
    this.categoryform = new FormGroup({
      name: new FormControl(this.category.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      icon: new FormControl(this.category.icon, Validators.required),
      order: new FormControl(this.order, Validators.required),
      color: new FormControl(this.category.color, [Validators.required])
   });
  }

  initializateCategory() {
    if (!this.category) {
      this.category = new Category();
      this.category.id = new Date().valueOf(); // genera el id unico
      this.category.name = '';
      this.category.icon = 'add-circle';
      this.order = this.categories.length;
      this.category.color = "white";
    } else {
      this.order = this.categories.findIndex(x => x.id === this.category.id);
    }
    this.addFirstFinalOrden();
  }

  
  async pushIconPage() {
    const modal = await this.modalController.create({
     component: SelectIconComponent
   });
   await modal.present();
   const { data } = await modal.onDidDismiss();
   if (data) {
     this.categoryform.controls.icon.setValue(data);
   }
 }

  addFirstFinalOrden() {

    const categoryFinal: Category = { id: 0, name: 'final', icon: 'add-circle',color: "black"};

    if (this.order === this.categories.length) {
      this.categories.push(categoryFinal);
    } else {
      this.categories[this.categories.length - 1 ] = categoryFinal;
    }

  }

  onSubmit() {
    const category = new Category();
    category.id = this.category.id;
    category.name = this.categoryform.get('name').value;
    category.icon = this.categoryform.get('icon').value;
    const order = this.categoryform.get('order').value;
    category.color = this.categoryform.get('color').value;

    this.categoryService.save(category, order);
    this.modalController.dismiss(category);

  }

  dismiss() {
    this.modalController.dismiss();
  }

  //TODO: migrar despues ha componete mas custmo
  
  async pushColorPage(ev: any) {
    const popover = await this.popoverController.create({
      component: SelectColorComponent,
      event: ev,
      translucent: true
    });
    await popover.present();
    
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.categoryform.controls.color.setValue(data);
    }

  }

}
