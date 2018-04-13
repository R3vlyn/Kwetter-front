import { ProfilePage } from './../profile/profile';
import { Observable } from 'rxjs/Observable';
import { UsersPageModule } from './users.module';
import { HttpClient } from '@angular/common/http';
import { SingletonService } from './../../services/singleton.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  UsersObservable: Observable<any>;
  loading: Loading;
  username: string;
  users: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, public singleton: SingletonService, public httpClient: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  loadUsers(username, call) {
    this.showLoading()
    this.UsersObservable = this.httpClient.get(call);
    this.UsersObservable
      .subscribe(data => {
        if (data instanceof Array) {
          this.loading.dismiss();
          this.users = data;
          ;
        }
      })
  }

  ionViewWillEnter() {
    if (this.navParams.data.user) {
      this.username = this.navParams.data.user;
      if(this.navParams.data.type ==="followers"){
        this.loadUsers(this.username, this.singleton.getFollowersCall(this.username));
      }
      if(this.navParams.data.type ==="following"){
        this.loadUsers(this.username, this.singleton.getFollowingCall(this.username));
      }
    }
  }

  goToUser(username) {
    this.navCtrl.push(ProfilePage, { user: username });
  }
}


