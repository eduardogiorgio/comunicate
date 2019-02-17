import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Category } from '../models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // saves localstorage
  CATEGORIES = 'categories';

  constructor(private storage: Storage) {}

  loadCategories() {
    const stringSettings = localStorage.getItem(this.CATEGORIES);
    if (stringSettings) {
      const categories = JSON.parse(stringSettings) as Category[];
      return categories;
    } else {
      const categories =  [];
      this.saveCategories(categories);

      return categories;
    }

  }

  save(category: Category, order: number) {
    const categories = this.loadCategories();
    const i = categories.findIndex(x => x.id === category.id);
    if (i < 0 ) {
      // categories.push(category);
      categories.splice(order, 0, category);
    } else {
      // categories[i] = category;

      if (i ===  order) {
        categories[i] = category;
      } else {
        // lo remueve y lo pone en la nueva posicion
        categories.splice(i, 1);
        categories.splice(order, 0, category);
      }


    }
    localStorage.setItem(this.CATEGORIES, JSON.stringify(categories));
  }

  delete(category: Category) {
    const categories = this.loadCategories();
    const i = categories.findIndex(x => x.id === category.id);
    if (i >= 0 ) {
      categories.splice(i, 1);
    }
    // busco la categoria al que pertenece
    this.saveCategories(categories);
  }

  saveCategories(categories: Category[]) {
    localStorage.setItem(this.CATEGORIES, JSON.stringify(categories));
  }
}
