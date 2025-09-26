import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import * as myGlobals from './global';
import {HeaderService} from "./header.service";


@Injectable({
  providedIn: 'root'
})

export class InitSession {

  static running = false;

  constructor(public httpClient: HttpClient, public storage:StorageService, public header:HeaderService)
  {
        this.initialize();
  }

  initialize(): void
  {
    InitSession.running = true;
    this.httpClient.post<any>(environment.apiroot + 'session-marche', {} , myGlobals.httpOptions).subscribe({
      next:(response:any) => {
          this.header.setToken(response.token);
        setInterval(() => {
          this.httpClient.post<string>(environment.apiroot + 'session-marche', {} , myGlobals.httpOptions).subscribe({
              next:(response:any) => {this.header.setToken(response.token);},
              error:(err:any) => {return;}
          });
        }, environment.refreshsessiontempo);
      },
      error:(err:any) => {return;}
    })
  }

}
