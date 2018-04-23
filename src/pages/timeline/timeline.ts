import { ProfilePage } from './../profile/profile';
import { SingletonService } from './../../services/singleton.service';
import { UserService } from './../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingCmp, LoadingController, ToastCmp, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the TimelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {
  timelineObservable: Observable<any>;
  kweetLikeObservable: Observable<any>;
  foundkweets: any[] = [];
  loading: Loading;
  platform: Platform;
  constructor(public httpClient: HttpClient, public navCtrl: NavController, public navParams: NavParams, platform: Platform, private userService: UserService, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public singleton: SingletonService) {
    this.platform = platform;
    this.getKweets();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');
  }

  likeKweet(kweet) {
    this.kweetLikeObservable = this.httpClient.post(this.singleton.likeKweetCall(this.userService.user, kweet.kweetId), null);
    this.kweetLikeObservable
      .subscribe(data => {
        console.log("kweetlike result succes: " + data.succes);
        if (data.succes) {
          let toast = this.toastCtrl.create({
            message: 'Kweet liked!',
            duration: 3000
          });
          toast.present();
          this.getKweets();
        } else {
          let toast = this.toastCtrl.create({
            message: data.result.value,
            duration: 3000
          });
          toast.present();
        }
      })
  }

  getKweets() {
    this.showLoading();
    this.timelineObservable = this.httpClient.get(this.singleton.timelinePostsCall(this.navParams.data.user));
    this.timelineObservable
      .subscribe(data => {
        console.log(data);
        this.foundkweets = data;
        this.loading.dismiss();
      })
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  calculateTimeAgo(postDate) {
      var date = new Date();
      var postdate = new Date(postDate);
      var hours = Math.abs(date.getTime() - postdate.getTime()) / 36e6;
      if (hours < 1) {
          return Math.ceil(hours * 60) + 'm'
      }
      return Math.ceil(hours) + 'h';
  }

  reformatDate(date) {
      var dateTime = date.split('T');
      var dateParts = dateTime[0].split('-');

      return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
  }

  goToProfile(username: any) {
      this.navCtrl.push(ProfilePage, { user: username });
  }

}
