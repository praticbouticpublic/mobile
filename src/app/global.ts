//
// ===== File globals.ts
//
'use strict';

import { HttpClient, HttpHeaders } from '@angular/common/http';


export const sep='/';
export const version: string="22.2.2";
export const defoffset = 0;
export const deflimite = 5;
export const rpp = [5,10,15,20,50,100];
export const filtres = [];
export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }),
  withCredentials: true
};
