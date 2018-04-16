import { UsersPage } from './../users/users';
import { ProfileUpdatePage } from './../profile-update/profile-update';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController } from 'ionic-angular';
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
  followUserObservable: Observable<any>;
  loading: Loading;

  username: string;
  userNumbers: any;
  profile: any;
  following: any;
  followers: any;
  kweets: any;
  isOtherProfile: any;
  isFollowing: any;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public singletonService: SingletonService,
    public httpClient: HttpClient,
    public artCtrl: AlertController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

    ionViewWillEnter() {
      if (this.navParams.data.user && this.navParams.data.user !== this.userService.user) {
            this.username = this.navParams.data.user;
            this.fetchProfile(this.username);
            this.fetchUserNumbers(this.username)
            this.isOtherProfile = true;

            this.checkFollowing(this.userService.user, (isFollowing) => {
                this.isFollowing = isFollowing;
            });
      } else {
          this.username = this.userService.user;
          this.fetchProfile(this.username);
          this.fetchUserNumbers(this.username);
          this.isOtherProfile = false;
      }
    }

    checkFollowing(user, _cb) {
        this.followingObservable = this.httpClient.get(this.singletonService.getFollowersCall(this.username));
        this.followingObservable.subscribe(data => {
           var d = data;
           var following = false;
           data.forEach(elem => {
                if (elem.username === this.userService.user) {
                  following = true;
                   _cb(true);
                }
            });
            if(!following){
              _cb(false);
            }
        });
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
    this.showLoading();
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
        this.loading.dismiss();
      } else {
        this.profile = {
          name: username,
          image: 'https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg',
          location: "",
          website: "",
          bio: "",
        };
        this.loading.dismiss();
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

  follow() {
    this.followUserObservable = this.httpClient.post(this.singletonService.followUserCall(this.userService.user, this.username), null);
    this.followUserObservable.subscribe(data => {
      if(data.succes){
        this.userNumbers.followers++;
        this.isFollowing = true;
        let toast = this.toastCtrl.create({
          message: data.result.value,
          duration: 3000
        });
        toast.present();
      }
    });
  }

  unFollow() {

  }
}
