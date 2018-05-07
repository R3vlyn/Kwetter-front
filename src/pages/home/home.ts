import { UsersPage } from './../users/users';
import { AuthenticatePage } from './../authenticate/authenticate';
import { TabsPage } from './../tabs/tabs';
import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { ProfilePage } from './../profile/profile';
import { UserService } from './../../services/user.service';
import { kweetEndpoint } from './../../services/kweetEndpoint.service';
import { User } from './../../models/user';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingCmp, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';
import { TimelinePage } from '../timeline/timeline';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {
  @ViewChild('searchbar') searchbar;
  filtertext: string;
  trendsObservable: Observable<any>;
  userTotalsObservable: Observable<any>;
  timelineObservable: Observable<any>;
  lastkweetObservable: Observable<any>;
  kweetPostObservable: Observable<any>;
  kweetLikeObservable: Observable<any>;
  trends: any[] = [];
  timeline: any[] = [];
  users: User[] = [];
  newKweetmessage: string;
  lastkweet:any;
  selectedSegment: string = 'Dashboard';
  usertotals:any;
  page: number = 1;
  amount: number = 7;
  loading: Loading;

  constructor(
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public singleton:SingletonService,
    public navCtrl: NavController,
    private userService: UserService,
    private kweetEndpoint: kweetEndpoint,
    public httpClient: HttpClient) {
    this.refreshUserTotals();
    this.refreshLastKweet();

    this.kweetEndpoint.onKweet((err, kweet) => {
      if (err) {
        console.log(err);
      } else {
        if (kweet.username !== this.userService.user) {
          let toast = this.toastCtrl.create({
            message: `@${kweet.username} has posted a new kweet!`,
            duration: 3000,
          });
          toast.present();
        }
      }
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

refreshTrends(){
  this.trendsObservable = this.httpClient.get(this.singleton.trendsCall());
  this.trendsObservable.subscribe(data => {
      if (data instanceof Array) {
        this.trends = data;
      }
  })
}

ionViewDidEnter(){
  let elements = document.querySelectorAll(".tabbar");

  if (elements != null) {
    Object.keys(elements).map((key) => {
      elements[key].style.display = 'flex';
    });
  }
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
        this.refreshTimeline();
      } else {
        let toast = this.toastCtrl.create({
          message: data.result.value,
          duration: 3000
        });
        toast.present();
      }
    })
}

searchbarFocus() {
  this.navCtrl.push(SearchPage)
}

refreshTimeline(){
  this.page = 1;
  this.timelineObservable = this.httpClient.get(this.singleton.timelineControlledCall(this.userService.user, this.page, this.amount));
  this.timelineObservable
  .subscribe(data => {
    this.timeline = data;
  })
}

loadMoreTimelineItems(infiniteScroll){
    this.page++;
    this.timelineObservable = this.httpClient.get(this.singleton.timelineControlledCall(this.userService.user, this.page, this.amount));
    this.timelineObservable.subscribe(data => {
      if(data !== null){
          Array.prototype.push.apply(this.timeline, data)
      }
      infiniteScroll.complete();
    })
}

  refreshLastKweet(){
    this.lastkweetObservable = this.httpClient.get(this.singleton.lastKweetsCall(1,this.userService.user));
    this.lastkweetObservable
    .subscribe(data => {
      if(data instanceof Array && data.length >0)
      {
        this.lastkweet = data[0];
        this.lastkweet.timeago = this.calculateTimeAgo(this.lastkweet.postDate);
        this.lastkweet.postDate = this.formatDate(this.lastkweet.postDate);
      }
    })
  }

  refreshUserTotals(){
    this.userTotalsObservable = this.httpClient.get(this.singleton.getUserTotalsCall(this.userService.user));
    this.userTotalsObservable
    .subscribe(data => {
      this.usertotals = data;
    })
  }

  getUsers(): void {
    this.userService.getUsers().then(users => this.users = users);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  goToUser(selectedUser: User) {
    this.navCtrl.push(ProfilePage, { user: selectedUser });
  }

  Match(user: User) {
    if (this.filtertext && this.filtertext !== "") {
      return true;
    }
    return false;
  }

  logout(){
    this.storage.set('bearer', null);
    this.navCtrl.setRoot(AuthenticatePage);
    //this.navCtrl.popToRoot();
  }

goToFollowers(){
  this.navCtrl.push(UsersPage, { type: "followers", user: this.userService.user });
}
goToFollowing(){
  this.navCtrl.push(UsersPage, { type: "following", user: this.userService.user });
}
goToKweets(){
  this.navCtrl.push(TimelinePage, {user: this.userService.user });
}

goToProfile(username: any) {
    this.navCtrl.push(ProfilePage, { user: username });
}

searchHashtag(hashtag: any) {
    this.navCtrl.push(SearchPage, { term: hashtag });
}

calculateTimeAgo(postDate) {
    var date = new Date();
    var postdate = new Date(postDate);
    var hours = Math.abs(date.getTime() - postdate.getTime()) / 36e6;
    if (hours < 1) {
        return Math.ceil(hours * 60) + 'm'
    } else if (hours > 24) {
        return Math.floor(hours / 24) + 'd';
    }
    return Math.floor(hours) + 'h';
}

filterMentions(message) {
    let filteredWords = [];
    const words = message.split(' ');
    words.forEach(word => {
        if (word.startsWith('@')) {
            word = '<i>' + word + '</i>';
        }
        filteredWords.push(word);
    });
    console.log(filteredWords.join(' '));
    return filteredWords.join(' ');
}

formatDate(date) {
    var dateTime = date.split('T');
    var dateParts = dateTime[0].split('-');

    return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
}

  postKweet(){
    this.kweetPostObservable = this.httpClient.post(this.singleton.createKweetCall(this.userService.user),
    {"message":this.newKweetmessage});
    this.kweetPostObservable.subscribe(data => {
      if(data.succes){
        let toast = this.toastCtrl.create({
          message: 'Kweet posted!',
          duration: 3000
        });
        toast.present();
        this.newKweetmessage ="";
        this.refreshLastKweet();
        this.refreshUserTotals();
      }
    });
  }
}
