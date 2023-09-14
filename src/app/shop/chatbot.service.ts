import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    return this.http.post('http://localhost:5005/webhooks/rest/webhook', { message: message });
  }
}