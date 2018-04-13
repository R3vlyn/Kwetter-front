import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user';
import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './../../services/user.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
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


  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public singletonService: SingletonService,
    public httpClient: HttpClient,
    private userService: UserService) {

    if (this.navParams.data.user) {
      this.username = this.navParams.data.user;
    } else {
      this.username = this.userService.user;
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
    this.profileObservable = this.httpClient.get(this.singletonService.getProfileCall(username));
    this.profileObservable.subscribe(data => {
      if (data && data[0]) {
        const profileData = data[0];
        this.profile = {
          name: profileData.name,
          image: "https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg",
          location: profileData.location,
          website: profileData.website,
          bio: profileData.bio,
        };
      } else {
        // For testing
        this.profile = {
          name: "Mickael Koyan",
          image: "http://www.nienesmoodlab.nl/uploads/1/3/1/5/13157012/7863622_orig.jpg",
          location: "Cleveland",
          website: "https://twitter.com/Twitter",
          bio: "Michael Koyan has had articles published on various websites. He is an online banking specialist for a financial institution based in the Cleveland, Ohio area.",
        };
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
}
