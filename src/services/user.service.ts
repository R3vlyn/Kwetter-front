import { SingletonService } from './singleton.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { USERS } from './../data/mockusers';
import { User } from './../models/user';
import { Injectable } from '@angular/core';


@Injectable()
export class UserService {
  user: string;
  bearer: string;
  loginObservable: Observable<any>;
  registerObservable: Observable<any>;
  constructor(public httpClient: HttpClient, public singleton:SingletonService) {

  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(USERS);
  }

  getUser(id: number): Promise<User> {
    return this.getUsers()
               .then(users => users.find(user => user.id === id));
  }

  login(credentials) : Observable<any>{
    return this.httpClient.post(this.singleton.loginCall(),
      {"username":credentials.username,"password":credentials.password});
  }

  register(credentials){
    this.registerObservable = this.httpClient.post(this.singleton.registerCall(),
    {"username":credentials.username,"password":credentials.password});
    this.loginObservable
    .subscribe(data => {
      console.log('register: ', data);
    })
  }
}
