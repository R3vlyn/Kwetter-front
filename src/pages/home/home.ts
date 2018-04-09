import { AuthenticatePage } from './../authenticate/authenticate';
import { TabsPage } from './../tabs/tabs';
import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { ProfilePage } from './../profile/profile';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingCmp, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
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

  constructor(private storage: Storage, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public singleton:SingletonService,public navCtrl: NavController, private userService: UserService,public httpClient: HttpClient) {
    this.refreshUserTotals();
    this.refreshLastKweet();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

refreshTrends(){
  //this.showLoading()
  this.trendsObservable = this.httpClient.get(this.singleton.trendsCall());
  this.trendsObservable
  .subscribe(data => {
    if(data instanceof Array){
      //this.loading.dismiss();
      this.trends = data;
    //   data.forEach(element => {
    //   this.trends.push(element);
    // })
    ;}
  })
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
    this.timelineObservable
    .subscribe(data => {
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
        var date = new Date();
        var postdate = new Date(data[0].postDate);
        var hours = Math.ceil(Math.abs(date.getTime() - postdate.getTime()) / 36e5);
        console.log("current time = " + date );
        console.log("Post time = " + postdate );
        this.lastkweet = {timeago: hours, message: data[0].message};
        console.log('Timeline: ', data);
      }
    })
  }

  refreshUserTotals(){
    this.userTotalsObservable = this.httpClient.get(this.singleton.getUserTotalsCall(this.userService.user));
    this.userTotalsObservable
    .subscribe(data => {
      this.usertotals = data;
      console.log('Usertotals: ', data);
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

  postKweet(){
    this.kweetPostObservable = this.httpClient.post(this.singleton.createKweetCall(this.userService.user),
    {"message":this.newKweetmessage});
    this.kweetPostObservable
    .subscribe(data => {
      console.log("kweetpost result succes: " + data.succes);
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
