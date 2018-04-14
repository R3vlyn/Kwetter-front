import { UsersPage } from './../users/users';
import { ProfileUpdatePage } from './../profile-update/profile-update';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user';
import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './../../services/user.service';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profileObservable: Observable<any>;
  userNumbersObservable: Observable<any>;
  followingObservable: Observable<any>;
  followersObservable: Observable<any>;
  kweetsObservable: Observable<any>;

  username: string;
  userNumbers: any;
  profile: any;
  following: any;
  followers: any;
  kweets: any;
  otherProfile: any;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public singletonService: SingletonService,
    public httpClient: HttpClient,
    public artCtrl: AlertController,
    private userService: UserService) {

    console.log("Username profile: " + this.userService.user);
    if (this.navParams.data.user) {
      this.username = this.navParams.data.user;
      this.otherProfile = "true";
    } else {
      this.username = this.userService.user;
      this.otherProfile = "false";
    }

    this.fetchProfile(this.username)
    this.fetchUserNumbers(this.username)
  }

  showFollowing() {
    this.followingObservable = this.httpClient.get(this.singletonService.getFollowingCall(this.username));
    this.followingObservable.subscribe(data => {
      console.log(data);
      this.following = data;
    });
  }

  showFollowers() {
    this.followersObservable = this.httpClient.get(this.singletonService.getFollowersCall(this.username));
    this.followersObservable.subscribe(data => {
      console.log(data);
      this.followers = data;
    });
  }

  showKweets() {
    this.kweetsObservable = this.httpClient.get(this.singletonService.searchKweetsCall(this.username));
    this.kweetsObservable.subscribe(data => {
      console.log(data);
      this.kweets = data;
    });
  }

  fetchProfile(username) {
    console.log('username: ' + username);
    this.profileObservable = this.httpClient.get(this.singletonService.getProfileCall(username));
    this.profileObservable.subscribe(data => {
      console.log(data);
      if (data !== null) {
        this.profile = {
          name: data.name,
          image: data.image,
          location: data.location,
          website: data.website,
          bio: data.bio,
        };
      } else {
        this.profile = {
          name: username,
          image: 'https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg',
          location: "",
          website: "",
          bio: "",
        };
        this.goToUpdateProfile();
      }
    });
  }

  fetchUserNumbers(username) {
    this.userNumbersObservable = this.httpClient.get(this.singletonService.getUserTotalsCall(username));
    this.userNumbersObservable.subscribe(data => {
      console.log(data);
      this.userNumbers = data;
    })
  }

  goToUpdateProfile() {
    this.navCtrl.push(ProfileUpdatePage, { profile: this.profile, username: this.username });
  }

  goToFollowing() {
    this.navCtrl.push(UsersPage, { type: "following", user: this.username });
  }

  goToFollowers() {
    this.navCtrl.push(UsersPage, { type: "followers", user: this.username });
  }

  goToKweets() {
    //this.navCtrl.push(TimelinePage, {user: this.username });
  }
}
