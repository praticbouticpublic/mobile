import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as myGlobals from './global';
import {HeaderService} from "./header.service";

@Injectable({
  providedIn: 'root'
})
export class DbacessService {

  constructor(public httpClient: HttpClient, public header:HeaderService) { }

    async getBoutics(){
    const pGetBoutics = { action:"listcustomer" };

    return this.httpClient.post<any>( environment.apiroot + "genquery", pGetBoutics, await this.header.buildHttpOptions());
  }
}
