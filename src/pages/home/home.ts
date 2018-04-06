import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchbar') searchbar;
  filtertext: string;
  constructor(public navCtrl: NavController) {

  }

  Match(person: Person) {
    if (this.filtertext && this.filter !== "") {
      return true;
    }
    return false;
  }

}
