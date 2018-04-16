import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UsersPage } from './../users/users';
import { User } from './../../models/user';
import { SingletonService } from './../../services/singleton.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './../../services/user.service';

/**
 * Generated class for the ProfileUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-update',
  templateUrl: 'profile-update.html',
})
export class ProfileUpdatePage {

  profileObservable: Observable<any>;
  profile: any;
  updatedProfile: any;
  username: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public singletonService: SingletonService,
    public httpClient: HttpClient,
    public alertCtrl: AlertController,
    private userService: UserService) {

    this.profile = this.navParams.data.profile;
    this.updatedProfile = {
        name: this.profile.name,
        bio: this.profile.bio,
        website: this.profile.website,
        location: this.profile.location,
        image: this.profile.image
    }
    this.username = this.navParams.data.username;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileUpdatePage');
  }

  saveProfile() {
    this.profileObservable =  this.httpClient.post(this.singletonService.setProfileCall(this.username), this.updatedProfile);
    this.profileObservable.subscribe(data => {
      console.log(data);
      if (data.succes) {
        this.profile.name = this.updatedProfile.name;
        this.profile.bio = this.updatedProfile.bio;
        this.profile.website = this.updatedProfile.website;
        this.profile.location = this.updatedProfile.location;
        this.profile.image = this.updatedProfile.image;
        this.navCtrl.pop();
      } else {
        this.showAlert(data.result.value);
      }
    });
  }

  onFileChange(event) {
    let fileList: FileList = event.target.files;
    console.log(fileList);
    if (fileList.length > 0) {
        let file: File = fileList[0];
        this.toBase64(file, (base64) => {
          this.updatedProfile.image = base64;
      })
    }
  }

  toBase64(file, _cb) {
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      _cb(reader.result);
    }
    reader.readAsDataURL(file);
  }

  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Invalid',
      subTitle: message,
      buttons: ['Close']
    });
    alert.present();
  }
}
