import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})

export class SelparamService {

    table = "";
    idtoup = 0;
    selcol = '';
    selid = 0;
    action  = '';
    soustable ='';
    cmdid = 0;
    lignecmdid = 0;

    getTable(useStorage:boolean = true): Promise<string>
    {
        return this.storage.get('table').then( table => {
            return (useStorage ? (table ?? "") : this.table);
        });
    }

    setTable(valeur:string)
    {
        this.storage.set('table', valeur !== null ? valeur : '');
        this.table = valeur;
    }

    getIdtoup(useStorage:boolean = true): Promise<number>
    {
        return this.storage.get('idtoup').then( idtoup => {
            return (useStorage ? (Number(idtoup ?? 0) ) : this.idtoup);
        });
    }

    setIdtoup(valeur:number)
    {
        this.storage.set('idtoup', valeur !== null ? valeur : '');
        this.idtoup = valeur;
    }

    getSelcol(useStorage:boolean = true): Promise<string>
    {
        return this.storage.get('selcol').then( selcol => {
            return (useStorage ? (selcol ?? "") : this.selcol);
        });
    }

    setSelcol(valeur:string)
    {
        this.storage.set('selcol', valeur !== null ? valeur : '');
        this.selcol = valeur;
    }

    getSelid(useStorage:boolean = true): Promise<number>
    {
        return this.storage.get('selid').then( selid => {
            return (useStorage ? Number(selid ?? 0) : this.selid);
        });
    }

    setSelid(valeur:number)
    {
        this.storage.set('selid', valeur !== null ? valeur : '');
        this.selid = valeur;
    }

    getAction(useStorage:boolean = true): Promise<string>
    {
        return this.storage.get('action').then( action => {
            return (useStorage ? (action ?? "") : this.action);
        });
    }

    setAction(valeur:string)
    {
        this.storage.set('action', valeur !== null ? valeur : '');
        this.action = valeur;
    }

    getSousTable(useStorage:boolean = true): Promise<string>
    {
        return this.storage.get('soustable').then( soustable => {
            return (useStorage ? (soustable ?? "") : this.soustable);
        });
    }

    setSousTable(valeur:string)
    {
        this.storage.set('soustable', valeur !== null ? valeur : '');
        this.soustable = valeur;
    }

    getCmdid(useStorage:boolean = true): Promise<number>
    {
        return this.storage.get('cmdid').then( cmdid => {
            return (useStorage ? (Number(cmdid ?? 0) ) : this.cmdid);
        });
    }

    setCmdid(valeur:number)
    {
        this.storage.set('cmdid', valeur !== null ? valeur : '');
        this.cmdid = valeur;
    }

    getLigneCmdid(useStorage:boolean = true): Promise<number>
    {
        return this.storage.get('lignecmdid').then( lignecmdid => {
            return (useStorage ? (Number(lignecmdid ?? 0) ) : this.cmdid);
        });
    }

    setLigneCmdid(valeur:number)
    {
        this.storage.set('lignecmdid', valeur !== null ? valeur : '');
        this.lignecmdid = valeur;
    }

    constructor(public storage: StorageService) { }

    initialize() {
        this.setTable('');
        this.setIdtoup(0);
        this.setSelcol('');
        this.setSelid(0);
        this.setAction('');
        this.setSousTable('');
        this.setCmdid(0);
        this.setLigneCmdid(0);
    }
}
