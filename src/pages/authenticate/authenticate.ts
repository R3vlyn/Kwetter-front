import { TabsPage } from './../tabs/tabs';
import { UserService } from './../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { SingletonService } from './../../services/singleton.service';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the AuthenticatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-authenticate',
  templateUrl: 'authenticate.html',
})
export class AuthenticatePage {
  loading: Loading;
  credentials: any = { "username": "", "password": "" }
  constructor(private storage: Storage, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public singleton: SingletonService, public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public userservice: UserService) {

  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewWillEnter(){
    this.validate();
  }

  login() {
    this.showLoading()
    this.userservice.login(this.credentials).subscribe(data => {
      console.log("loginresult:" + data)
      if (data.result.value.includes("Bearer")) {
        var jwt = data.result.value;
        var tokenobj = this.parseJwt(jwt);
        this.userservice.bearer = jwt;
        this.storage.set('bearer', jwt);
        this.userservice.user = tokenobj.sub;
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.showError("Authentication failed");
      });
  }

  validate() {
    this.storage.get('bearer').then((val) => {
      if (val !== null) {
        this.showLoading()
        this.userservice.validate(val).subscribe(data => {
          console.log("loginresult:" + data)
          if (data.result.value.includes("valid")) {
            var tokenobj = this.parseJwt(val);
            this.userservice.user = tokenobj.sub;
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.loading.dismiss();
            this.storage.set('bearer', null);
          }
        },
          error => {
            this.loading.dismiss();
            this.storage.set('bearer', null);
          });
      }
    });
  }

  parseJwt(token) {
    token.replace('Bearer ', '');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };
}
