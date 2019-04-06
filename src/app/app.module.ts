import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

// import { SQLite } from '@ionic-native/sqlite/ngx';
import { Camera } from '@ionic-native/camera/ngx';

// TODO: all put in the moudle ? tabs module and other in settings
import { CategoryService } from './services/category.service';
import { GroupService } from './services/group.service';
import { ActionService } from './services/action.service';

import { ActionEditComponent } from './action-edit/action-edit.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

// pipe
import { ActionsByGroupPipe } from './pipes/actions-pipe';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './services/settings.service';

//hammer events
import { IonicGestureConfig } from './gestures/ionic-gesture-config';

@NgModule({
  declarations: [AppComponent, ActionEditComponent, GroupEditComponent, CategoryEditComponent, SettingsComponent],
  entryComponents: [ActionEditComponent, GroupEditComponent, CategoryEditComponent, SettingsComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    CategoryService,
    GroupService,
    ActionService,
    SettingsService,
    // SQLite,
    Camera,
    PhotoLibrary,
    Crop,
    TextToSpeech,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
