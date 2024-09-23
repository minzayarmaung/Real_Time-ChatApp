import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
  providers: [ChatService]
})
export class ChatMainComponent implements OnInit {

  messages: string[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.connect();
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
