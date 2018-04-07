import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { ProfilePage } from './../profile/profile';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

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

  constructor(public toastCtrl: ToastController, public singleton:SingletonService,public navCtrl: NavController, private userService: UserService,public httpClient: HttpClient) {
    this.trendsObservable = this.httpClient.get(singleton.trendsCall());
    this.trendsObservable
    .subscribe(data => {
      if(data instanceof Array){
        data.forEach(element => {
        this.trends.push(element);
      });}

    })


    this.timelineObservable = this.httpClient.get(singleton.timelineCall(this.userService.user));
    this.timelineObservable
    .subscribe(data => {
      this.timeline = data;
      console.log('Timeline: ', data);
    })
    this.refreshUserTotals();
    this.refreshLastKweet();

  }

  refreshLastKweet(){
    this.lastkweetObservable = this.httpClient.get(this.singleton.lastKweetsCall(1,this.userService.user));
    this.lastkweetObservable
    .subscribe(data => {
      if(data instanceof Array)
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
