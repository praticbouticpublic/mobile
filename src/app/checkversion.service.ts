import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckversionService {

  minversion: any[];
  appversion: any[];

  constructor(public httpClient: HttpClient) { }

  chargementAuthorisation(autho: any)
  {
    this.minversion = autho.minversion.split('.');
    this.appversion = environment.appversion.split('.');
  }

  checkVersion(): boolean
  {
    if (parseInt(this.minversion[0]) <= parseInt(this.appversion[0]))
    {
      if (parseInt(this.minversion[1]) <= parseInt(this.appversion[1]))
      {
        if (parseInt(this.minversion[2]) <= parseInt(this.appversion[2]))
        {
          return true;
        }
      }
    }
    return false;
  }

}
