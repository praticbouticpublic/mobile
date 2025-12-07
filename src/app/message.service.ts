import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSubject: any;

  constructor() {
      this.init();
  }

  init()
  {
    this.messageSubject = new Subject<any>();
  }

  publishMessage(data: any) {
    this.messageSubject.next(data);
  }

  completeMessage()
  {
    this.messageSubject.complete();
  }

  getObservable(): Subject<any>
  {
    return this.messageSubject;
  }

}
