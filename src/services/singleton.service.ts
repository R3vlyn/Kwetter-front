import { Injectable } from '@angular/core';

@Injectable()
export class SingletonService {
  public baseUrl: string = "http://localhost:8080/Kwetter-1.0-SNAPSHOT/rest/";

 public baseUserUrl: string = this.baseUrl + "user/";

  public kweetSearchUrl: string = "kweet/search/";
  public mentionsUrl: string = "kweet/mentions/";
  public lastKweetsUrl: string = "kweet/last/";
  public timelineUrl: string = "kweet/timeline/";
  public createKweetUrl: string = "kweet/create/";
  public trendsUrl: string = "hashtag/trends";
  public loginUrl: string = "authentication/login";
  public profileUrl: string = "/profile";
  public followersUrl: string = "/followers";
  public setProfileUrl: string = "profile/";
  public followingUrl: string = "/following";
  public userTotalsUrl: string = "byusername/";
  public registerUrl: string = "kweet/register";
  public followUserUrl: string = "/following/add/";
  public user: string

  searchKweetsCall(filter): string {
    return this.baseUrl + this.kweetSearchUrl + filter;
  }
  mentionsCall(username):string{
    return this.baseUrl + this.mentionsUrl + username;
  }
  lastKweetsCall(amount, username):string{
    return this.baseUrl + this.lastKweetsUrl + amount + "/" + username;
  }
  timelineCall(username):string{
    return this.baseUrl + this.timelineUrl + username;
  }
  createKweetCall(username):string{
    return this.baseUrl + this.createKweetUrl + username;
  }
  trendsCall():string{
    return this.baseUrl + this.trendsUrl;
  }
  loginCall():string{
    return this.baseUrl + this.loginUrl;
  }
  registerCall():string{
    return this.baseUrl + this.registerCall;
  }
  getProfileCall(username):string{
    return this.baseUserUrl + username + this.profileUrl;
  }
  getFollowersCall(username):string{
    return this.baseUserUrl + username + this.followersUrl;
  }
  setProfileCall(username):string{
    return this.baseUserUrl + this.setProfileUrl + username;
  }
  getFollowingCall(username):string{
    return this.baseUserUrl + username + this.followingUrl;
  }
  getUserTotalsCall(username):string{
    return this.baseUserUrl + this.userTotalsUrl + username;
  }
  followUserCall(username, following):string{
    return this.baseUserUrl + username + this.followUserUrl + following;
  }
}
