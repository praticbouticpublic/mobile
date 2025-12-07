import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  willQuit: boolean = false;
  login: string = '';
  formComponent: any = null;
  server: string ='';
  logged: boolean = false;

  getWillQuit()
  {
    return this.willQuit;
  }

  setWillQuit(mywillquit: boolean)
  {
    this.willQuit = mywillquit;
  }

  getLogin()
  {
    return this.login;
  }

  setLogin(mylogin: string)
  {
    this.login = mylogin;
  }

  getServer()
  {
    return this.server;
  }

  setServer(myserver: string)
  {
    this.server = myserver;
  }

  getFormComponent()
  {
    return this.formComponent;
  }

  setFormComponent(myFormComponent: any)
  {
    this.formComponent = myFormComponent;
  }

  constructor() { }
}
