import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import * as myGlobals from '../app/global';
import {HeaderService} from "./header.service";

interface Publication {
  form: any;
  msg: string;
}

@Injectable({
  providedIn: 'root'
})



export class ModeleService {

  tables: any;
  liens:any;
  error = new Subject<Publication>();

  constructor(public httpClient: HttpClient, public header:HeaderService) {
  }

  chargementDbd(dbd: any)
  {
    this.tables = dbd.tables;
    this.liens = dbd.liens;
  }

  getTables()
  {
    return this.tables;
  }

  getTable(number: number)
  {
    return this.tables[number];
  }

  getnumtable(nom: string)
  {
    let numtable: any;
    for (let i=0; i<this.tables.length; i++)
      if (nom == this.tables[i].nom)
        numtable = i;

    return numtable;
  }

  getTableParNom(nom: string)
  {
    return this.tables[this.getnumtable(nom)];
  }

  getLiens()
  {
    return this.liens;
  }


    async getData(bouticid: any, table: any, limite: any, offset: any, selcol: any, selid: any, filtres: any){
    const obj2 = { bouticid, table, colonne:"", row:"", idtoup:"", limite, offset, selcol, selid, filtres };
    return this.httpClient.post<any>( environment.apiroot + "vue-table", obj2, await this.header.buildHttpOptions());
  }

    async getRowCount(bouticid: any, table: any, selcol: any, selid: any, filtres: any){
        const obj3 = { bouticid, action:"elemtable", table, colonne:"", row:"", idtoup:"", limite:"", offset:"", selcol, selid, filtres };
        return this.httpClient.post<any>( environment.apiroot + "count-elements", obj3, await this.header.buildHttpOptions());
    }

    async insertrow(bouticid: any, table: any, row: any, form: any): Promise<boolean>
    {
        const obj = { bouticid, table, colonne:'', row };
        try
        {
            await firstValueFrom(this.httpClient.post<string>(environment.apiroot + 'insert-row', obj, await this.header.buildHttpOptions()))
            this.error.next({ form, msg: null });
            return false;
        }
        catch (err: any)
        {
            this.error.next({ form, msg: err.error.error });
            return true;
        }
    }

    async updaterow(bouticid: any, table: any, row: any, pknom: any, idtoup: any, form: any): Promise<boolean>
    {
        const obj = { bouticid, table, colonne:pknom, row, idtoup };
        try
        {
            await firstValueFrom(this.httpClient.post(environment.apiroot + 'update-row', obj, await this.header.buildHttpOptions()))
            this.error.next({ form, msg: null });
            return false;
        }
        catch (err: any)
        {
            this.error.next({ form, msg: err.error.error });
            return true;
        }
    }
}
