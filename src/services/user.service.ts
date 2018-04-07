import { HttpClient } from '@angular/common/http';
import { USERS } from './../data/mockusers';
import { User } from './../models/user';
import { Injectable } from '@angular/core';


@Injectable()
export class UserService {

  constructor(public httpClient: HttpClient) {

  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(USERS);
  }

  getUser(id: number): Promise<User> {
    return this.getUsers()
               .then(users => users.find(user => user.id === id));
  }
}
