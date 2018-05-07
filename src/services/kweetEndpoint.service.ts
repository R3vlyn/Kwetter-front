import { SingletonService } from './singleton.service';
import { Injectable } from '@angular/core';


@Injectable()
export class kweetEndpoint {
  private HOST: string = 'localhost';
  private PORT: string = '8080';
  private webSocket: any;

  constructor() {
    this.webSocket = new WebSocket(`ws://${this.HOST}:${this.PORT}/Kwetter-1.0-SNAPSHOT/websocket/kweet`);
    this.webSocket.onopen = function() {
      console.log("connection opened");
    };
    this.webSocket.onclose = function() {
        console.log("connection closed");
    };
    this.webSocket.onerror = function(err) {
        console.log("error: " + err);
    };
  }

  onMessage(callback) {
    this.webSocket.onmessage = function(message) {
      callback(null, message);
    }
  }
}
