import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpHeaders} from "@angular/common/http";
import * as globals from './global';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

    token:any;
    options:any;
    headeropt:any;

    constructor(public storage: StorageService) {
        //this.initHttpOptions();
    }

    private async initHttpOptions() {
        //this.headeropt = this.buildHttpOptions();
    }

   getToken(useStorage :boolean = true):any {
       this.storage.get('jwt_token').then((token: string) => {
           return useStorage ? token : this.token;
       });
   }

    setToken( token:  any, useStorage :boolean = true) {
        if (useStorage)
            this.storage.set('jwt_token', token).then(r => {});
    }

    async buildHttpOptions(isUpload = false): Promise<{ headers: HttpHeaders }> {
        const token: string = await this.storage.get('jwt_token');
        const headersConfig: any = {
            'Accept': 'application/json'
        };

        if (!isUpload) {
            headersConfig['Content-Type'] = 'application/json';
        }

        if (token) {
            headersConfig['Authorization'] = `Bearer ${token}`;
        }

        return {
            headers: new HttpHeaders(headersConfig)
        };
    }
}
