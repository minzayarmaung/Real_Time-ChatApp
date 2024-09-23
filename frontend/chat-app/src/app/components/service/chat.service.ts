import { Injectable } from '@angular/core';
import { Client, IStompSocket, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private client: Client;
  private messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this.client = new Client();

    // Use SockJS for environments that don't support native WebSockets
    this.client.webSocketFactory = (): IStompSocket => {
        return new SockJS('http://localhost:8080/chat') as IStompSocket;
    };
  }

  // Connect to WebSocket server
  connect(): void {
    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.client.subscribe('/topic/messages', (message: Message) => {
        const body = JSON.parse(message.body);
        this.addMessage(body.content);
      });
    };
    this.client.activate();
  }

  // Disconnect from the WebSocket server
  disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
    }
  }

  // Send a message to the WebSocket server
  sendMessage(message: string): void {
    this.client.publish({
      destination: '/app/sendMessage',  // Replace with your destination
      body: JSON.stringify({ content: message }),
    });
  }

  // Get observable messages stream
  getMessages(): Observable<string[]> {
    return this.messages.asObservable();
  }

  // Helper function to add messages to the BehaviorSubject
  private addMessage(message: string): void {
    const currentMessages = this.messages.getValue();
    currentMessages.push(message);
    this.messages.next(currentMessages);
  }
}
