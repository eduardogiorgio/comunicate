import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // saves localstorage
  SETTINGS = 'settings';

  constructor(private storage: Storage) {}

  private getSettingsDefault() {
    const settginsDefault = new Settings();

    settginsDefault.pattern = 0;
    settginsDefault.patternPassword = ""; // hacer enum
    settginsDefault.seletedHistory =  false;
    settginsDefault.columnsPerRow =  0; // 0 automatico
    settginsDefault.ShowCategories =  2; // hacer enum
    settginsDefault.ShowGroup = 2; // hacer enum
    settginsDefault.showGroupAll =  false; // mostrar todos los grupos

    settginsDefault.rateSpeek =  0.80; // volumen 0 a 1 utilizar  slider
    settginsDefault.localeSpeek = 'es-AR'; // idioma por defecto del dispositivo buscar

    return settginsDefault;
  }

  loadSettings() {
    const stringSettings = localStorage.getItem(this.SETTINGS);
    if (stringSettings) {
      const settings = JSON.parse(stringSettings) as Settings;
      return settings;
    } else {
      // guardar en algo el default por si no puede cargarla algo asi
      const settings = this.getSettingsDefault();
      this.saveSettings(settings);

      return settings;
    }

  }

  saveSettings(settings: Settings) {
    localStorage.setItem(this.SETTINGS, JSON.stringify(settings));
  }
}
