import { Injectable } from '@angular/core';
import { TypeMethod } from 'src/app/typemethod.enum';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class SessionfrontService {
  bouticid = 0;
  logo = '';
  aliasboutic = '';
  method = 0;
  mailstatus = '';
  table = 0;
  nomboutic = '';

  constructor(public storage: StorageService) { }

  getBouticId(useStorage:boolean = true): Promise<number>
  {
    return this.storage.get('bouticid').then(bouticid => {
      return (useStorage ? +bouticid : this.bouticid);
    });
  }

  setBouticId(id:number)
  {
    this.storage.set('bouticid', String(id));
    this.bouticid = id;
  }

  getLogo(useStorage:boolean = true) : Promise<string>
  {
    return this.storage.get('logo').then(logo => {
      return (useStorage ? logo : this.logo);
    });
  }

  setLogo(filename: string)
  {
    this.storage.set('logo', filename);
    this.logo = filename;
  }

  getAliasBoutic(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('aliasboutic').then(aliasboutic => {
      return (useStorage ? aliasboutic : this.aliasboutic);
    });
  }

  setAliasBoutic(nom: string)
  {
    this.storage.set('aliasboutic', nom);
    this.aliasboutic = nom;
  }

  getMethod(useStorage:boolean = true) : Promise<TypeMethod>
  {
    return this.storage.get('method').then(method => {
      return (useStorage ? +method : this.method);
    });
  }

  setMethod(no: number)
  {
    this.storage.set('method', String(no));
    this.method = no;
  }

  setTable(no: number)
  {
    this.storage.set('table', String(no));
    this.table = no;
  }

  getTable(useStorage:boolean = true) : Promise<number>
  {
    return this.storage.get('table').then(table => {
      return (useStorage ? +table : this.table);
    });
  }

  setNomBoutic(str: string)
  {
    this.storage.set('nomboutic', str);
    this.nomboutic = str;
  }

  getNomBoutic(useStorage:boolean = true) : Promise<string>
  {
    return this.storage.get('nomboutic').then(nomboutic => {
      return (useStorage ? nomboutic : this.nomboutic);
    });
  }

  razSessionFront()
  {
    this.storage.remove('bouticid');
    this.storage.remove('logo');
    this.storage.remove('aliasboutic');
    this.storage.remove('method');
    this.storage.remove('table');
    this.storage.remove('nomboutic');
  }

}
