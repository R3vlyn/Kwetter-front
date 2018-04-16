import { UserService } from './../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { SingletonService } from './../../services/singleton.service';
import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { ProfilePage } from './../profile/profile';
import { NavController, NavParams, Platform, LoadingController, ToastController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  platform: Platform;
  @ViewChild('searchbar') searchbar;
  kweetLikeObservable: Observable<any>;
  timelineObservable: Observable<any>;
  foundkweets: any[] = [];
  filtertext: string = "";
  loading: Loading;

  constructor(public httpClient: HttpClient, public navCtrl: NavController, public navParams: NavParams, platform: Platform, private userService: UserService, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public singleton: SingletonService) {
    this.platform = platform;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  // Fastest for instant search
  ionViewWillEnter() {
      const term = this.navParams.data.term;
      if (term) {
          this.filtertext = term;
          // Trigger search
          this.searchKweets(term);
      }
  }

  ionViewDidEnter(){
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }

    this.platform.ready().then(() => {
    });
    setTimeout(() => {
      this.searchbar.setFocus();
    });
  }

  filterchanged() {
    if (this.filtertext.length > 2) {
      this.searchKweets(this.filtertext);
    }
  }

  searchKweets(filtertext) {
    //this.showLoading();
    this.timelineObservable = this.httpClient.get(this.singleton.searchKweetsCall(filtertext));
    this.timelineObservable
      .subscribe(data => {
        this.foundkweets = data;
        //this.loading.dismiss();
        this.platform.ready().then(() => {
        });
        setTimeout(() => {
          this.searchbar.setFocus();
        });
      })
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  goToUser(user) {

  }

  goToHashtag(hashtag) {

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
          this.searchKweets(this.filtertext);
        } else {
          let toast = this.toastCtrl.create({
            message: data.result.value,
            duration: 3000
          });
          toast.present();
        }
      })
  }

  calculateTimeAgo(kweet) {
      var date = new Date();
      var postdate = new Date(kweet.postDate);
      var hours = Math.floor(Math.abs(date.getTime() - postdate.getTime()) / 36e5);

      return hours;
  }

  reformatDate(date) {
      var dateTime = date.split('T');
      var dateParts = dateTime[0].split('-');

      return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
  }

  goToProfile(username: any) {
      this.navCtrl.push(ProfilePage, { user: username });
  }

  searchHashtag(hashtag: any) {
      this.filtertext = hashtag;
      this.searchKweets(hashtag);
  }
}
