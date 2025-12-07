import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionbackService {

  logged: boolean;

  constructor(public storage: StorageService) { }

  getLogged(useStorage:boolean = true): Promise<boolean>
  {
    return this.storage.get('logged').then(logged => {
      return (useStorage ? Boolean(+logged) : this.logged);
    });
  }

  setLogged(state:boolean)
  {
    this.storage.set('logged', Boolean(+state));
    this.logged = state;
  }

}
