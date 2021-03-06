import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings';
import { ModalController } from '@ionic/angular';
import { TourComponent } from '../tour/tour.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: Settings;
  constructor(private modalController: ModalController, private settingService: SettingsService) { }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settings = this.settingService.loadSettings();
  }

  saveSettings() {
    this.settingService.saveSettings(this.settings);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async showTour() {
    const modal = await this.modalController.create({
     component: TourComponent,
   });
   await modal.present();
 }
}
