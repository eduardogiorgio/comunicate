import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICONS } from '../mocks/mock.icons';


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
  constructor(private modalController: ModalController, private categoryService: CategoryService) { }

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
      order: new FormControl(this.order, Validators.required)
   });
  }

  initializateCategory() {
    if (!this.category) {
      this.category = new Category();
      this.category.id = new Date().valueOf(); // genera el id unico
      this.category.name = 'My new Category';
      this.category.icon = 'add-circle';
      this.order = this.categories.length;
    } else {
      this.order = this.categories.findIndex(x => x.id === this.category.id);
    }
    this.addFirstFinalOrden();
  }

  addFirstFinalOrden() {

    const categoryFinal: Category = { id: 0, name: 'final', icon: 'add-circle'};

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

    this.categoryService.save(category, order);
    this.modalController.dismiss(category);

  }

  dismiss() {
    this.modalController.dismiss();
  }

}
