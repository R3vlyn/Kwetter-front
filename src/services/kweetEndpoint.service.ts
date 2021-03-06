import { UserService } from './user.service';
import { Injectable } from '@angular/core';


@Injectable()
export class kweetEndpoint {
  private HOST: string = 'localhost';
  private PORT: string = '8080';
  private webSocket: any = null;

  constructor(private userService: UserService) { }

  onKweet(callback) {
    this.checkWebSocket().then(() => {
      this.webSocket.onmessage = function(message) {
        callback(null, JSON.parse(message.data));
      }
    });
  }

  checkWebSocket() {
    return new Promise((resolve, reject) => {
      if (!this.webSocket) {
        this.webSocket = new WebSocket(`ws://${this.HOST}:${this.PORT}/Kwetter-1.0-SNAPSHOT/websocket/kweet/${this.userService.user}`);
        this.webSocket.onopen = function() {
          console.log("connection opened");
        };
        this.webSocket.onclose = function() {
            console.log("connection closed");
        };
        this.webSocket.onerror = function(err) {
            console.log(err);
        };
      }
      resolve();
    });
  }
}
