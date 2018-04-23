import { TimelinePage } from './../pages/timeline/timeline';
import { SearchPage } from './../pages/search/search';
import { UsersPage } from './../pages/users/users';
import { UserService } from './../services/user.service';
import { AuthenticatePage } from './../pages/authenticate/authenticate';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ProfilePage } from '../pages/profile/profile';
import { ProfileUpdatePage } from '../pages/profile-update/profile-update';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { SingletonService } from '../services/singleton.service';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    UsersPage,
    HomePage,
    TabsPage,
    AuthenticatePage,
    ProfileUpdatePage,
    SearchPage,
    TimelinePage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TimelinePage,
    SearchPage,
    AuthenticatePage,
    MyApp,
    ProfilePage,
    UsersPage,
    HomePage,
    TabsPage,
    ProfileUpdatePage
  ],
  providers: [
    UserService,
    SingletonService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
