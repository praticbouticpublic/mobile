import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetbackService {

  private getbackSubject = new Subject<any>();

  constructor() { }

  publishGetback(data: any) {
    this.getbackSubject.next(data);
  }

  getObservable(): Subject<any> {
      return this.getbackSubject;
  }

}
