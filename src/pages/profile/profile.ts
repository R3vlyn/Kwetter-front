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

  username: string;
  profile: any;
  profileObservable: Observable<any>;

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

    this.fetchProfile(singletonService, this.username)
  }

  fetchProfile(singletonService, username) {
    this.profileObservable = this.httpClient.get(singletonService.getProfileCall(username));
    this.profileObservable.subscribe(data => {
      if (data) {
        const profileData = data[0];
        this.profile = {
          name: profileData.name,
          image: "https://www.watsonmartin.com/wp-content/uploads/2016/03/default-profile-picture.jpg",
          location: profileData.location,
          website: profileData.website,
          bio: profileData.bio,
        };
      } else {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
}
