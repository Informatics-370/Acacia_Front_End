import { Component, ViewChild } from '@angular/core';
import { ChatbotService } from '../chatbot.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';



export interface Message {
  type: string;
  message: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isOpen = false;
  loading = false;
  messages: Message[] = [];
  chatForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  //scrolling to thru the chatbot
  @ViewChild('scrollMe') private myScrollContainer: any;

  constructor(private chatbotService: ChatbotService) {
  }

  //Changes a boolean to whatever it is not
  //by default it is set to false in line 16
  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const sentMessage = this.chatForm.value.message!;
    this.loading = true;
    this.messages.push({
      type: 'user',
      message: sentMessage,
    });
    this.chatForm.reset();
    this.scrollToBottom();
    this.chatbotService.sendMessage(sentMessage).subscribe((response: any) => {
      for (const obj of response) {
        let value
        if (obj.hasOwnProperty('text') ) {
          value = obj['text']
          this.pushMessage(value)

        }
        if (obj.hasOwnProperty('image') ) {
          value = obj['image']
          this.pushMessage(value)
        }
      }
    });
  }

  pushMessage(message:string){
     this.messages.push({
        type: 'client',
        message: message,
      });
      this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight + 500;
      } catch (err) {}
    }, 150);
  }
}

/*---------------------RUNNING THE CHATBOT API-------------------*/
// METHOD 1 : rasa run -m models --enable-api --cors "*" -p 5005


// OR METHOD 2 : python -m  rasa run -m model --enable-api --cors "*" -p 5005


