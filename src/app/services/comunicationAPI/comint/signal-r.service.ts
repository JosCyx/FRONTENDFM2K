import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: signalR.HubConnection;
  private clientCountSource = new BehaviorSubject<number>(0);
  clientCount$ = this.clientCountSource.asObservable();

  constructor() {
    this.startConnection();
    this.addClientCountListener();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://fm2kprogreso.org.ec/652318971313582326852/alertHub') 
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  private addClientCountListener() {
    this.hubConnection.on('UpdateClientCount', (count: number) => {
      this.clientCountSource.next(count);
    });
  }
}
