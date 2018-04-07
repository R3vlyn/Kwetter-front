import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { ProfilePage } from './../profile/profile';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[UserService]
})
export class HomePage {
  @ViewChild('searchbar') searchbar;
  filtertext: string;
  trendsObservable: Observable<any>;
  userTotalsObservable: Observable<any>;
  trends: string[] = [];
  users: User[] = [];
  selectedSegment: string = 'Dashboard';
  loggedInUser:string = "henk"
  usertotals:any;

  constructor(public singleton:SingletonService,public navCtrl: NavController, private userService: UserService,public httpClient: HttpClient) {
    this.trendsObservable = this.httpClient.get(singleton.trendsCall());
    this.trendsObservable
    .subscribe(data => {
      data.forEach(element => {
        this.trends.push(element);
      });

    })
    this.userTotalsObservable = this.httpClient.get(singleton.getUserTotalsCall(this.loggedInUser));
    this.userTotalsObservable
    .subscribe(data => {
      this.usertotals = data;
      console.log('my data: ', data);
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

}
