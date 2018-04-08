import { UserService } from './../services/user.service';
import { AuthenticatePage } from './../pages/authenticate/authenticate';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { SingletonService } from '../services/singleton.service';
@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    TabsPage,
    AuthenticatePage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthenticatePage,
    MyApp,
  ProfilePage,
    HomePage,
    TabsPage
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
