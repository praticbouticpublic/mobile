import { Injectable } from '@angular/core';
import { ModeleService } from './modele.service';
import { StorageService } from './storage.service';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as myGlobals from './global';
import {HeaderService} from "./header.service";

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  total: any;
  notifid = 0;
  timerHandle: any;

  constructor(public model: ModeleService, public storage: StorageService, public msg: MessageService,
              public httpClient: HttpClient, public header:HeaderService)
  {

  }

  lireParamNewCmd(bouticid: number): Observable<any>
  {
    const obj = { bouticid, param:'NEW_ORDER' };
    return this.httpClient.post<string>(environment.apiroot + 'get-param', obj, await this.header.buildHttpOptions());
  }

  razParamNewCmd(bouticid: number): Observable<any>
  {
    const obj = { bouticid, action:'setparam', param:'NEW_ORDER', valeur:'0' };
    return this.httpClient.post<string>(environment.apiroot + 'set-param', obj, await this.header.buildHttpOptions());
  }

  startMonitoring(bouticid:any)
  {
    this.msg.init();
    this.timerHandle = setInterval((): void => {
      this.playMonitoring(bouticid);
    }, environment.tempomonitor);
  }

  stopMonitoring()
  {
    clearInterval(this.timerHandle);
  }

  playMonitoring(bouticid:any)
  {
    let nbnewcmd = 0;

    this.lireParamNewCmd(bouticid).subscribe({
      next:(nombre: string) => {
        if (+nombre > 0)
        {
          this.razParamNewCmd(bouticid).subscribe({
            next:(data: string) => {
            }, error:(err:any) => {
              return ;
            }
          });
        }
      }
    });
  }

}
