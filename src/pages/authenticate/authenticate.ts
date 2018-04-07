import { TabsPage } from './../tabs/tabs';
import { UserService } from './../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { SingletonService } from './../../services/singleton.service';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';

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
  credentials: any = {"username": "","password":""}
  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, public singleton:SingletonService, public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient, public userservice:UserService) {
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthenticatePage');
  }

  login() {
    this.showLoading()
    this.userservice.login(this.credentials).subscribe(data => {
      console.log("loginresult:" + data)
      if (data.result.value.includes("Bearer")) {
        var jwt = data.result.value;
        var tokenobj = this.parseJwt(jwt);
        this.userservice.bearer = jwt;
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

  parseJwt (token) {
    token.replace('Bearer ','');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
}
