import { Injectable } from '@angular/core';

@Injectable()
export class SingletonService {
  private baseUrl: string = "http://localhost:8080/Kwetter-1.0-SNAPSHOT/rest/";

 private baseUserUrl: string = this.baseUrl + "user/";

 private kweetSearchUrl: string = "kweet/search/";
 private mentionsUrl: string = "kweet/mentions/";
 private lastKweetsUrl: string = "kweet/last/";
 private timelineUrl: string = "kweet/timeline/";
 private timelineControlledUrl: string = "kweet/timelinecontrolled/";

 private likeKweerUrl: string = "kweet/like/"
 private createKweetUrl: string = "kweet/create/";
 private trendsUrl: string = "hashtag/trends";
 private loginUrl: string = "authentication/login";
 private validateTokenUrl: string = "authentication/validate";
 private profileUrl: string = "/profile";
 private followersUrl: string = "/followers";
 private setProfileUrl: string = "profile/";
 private followingUrl: string = "/following";
 private userTotalsUrl: string = "byusername/";
 private registerUrl: string = "kweet/register";
 private followUserUrl: string = "/following/add/";
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

  timelineControlledCall(username, page,amount):string{
    return this.baseUrl + this.timelineControlledUrl + username + "/" + page + "/" + amount;
  }

  likeKweetCall(username, kweetid):string{
    return this.baseUrl + this.likeKweerUrl + kweetid + "/" + username;
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

  validateTokenCall():string{
    return this.baseUrl + this.validateTokenUrl;
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
