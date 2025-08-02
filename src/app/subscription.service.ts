import { Injectable } from '@angular/core';
import * as st from './subscriptiontype.enum';

@Injectable({
  providedIn: 'root'
})

export class SubscriptionService {
  abomode = st.SubscriptionType.AUCUN;
  customerid = '';
  priceid = '';
  subscriptionid = '';
  clientsecret = '';
  
  constructor() { }

  setAboMode(abomd: number)
  {
    sessionStorage.setItem('abomode', String(abomd));
    this.abomode = abomd;
  }

  getAboMode(useStorage: boolean = false): number
  {
    return (useStorage ? +String(sessionStorage.getItem('abomode')) : this.abomode);
  }

  clearAboMode()
  {
    sessionStorage.removeItem('abomode');
    this.abomode = st.SubscriptionType.AUCUN;
  }


  setAbonementConsoParam(customerid: string, priceid: string)
  {
    this.customerid = customerid;
    this.priceid = priceid;
  }

  setAbonementFixeParam(subscriptionid: string, clientsecret: string)
  {
    this.subscriptionid = subscriptionid;
    this.clientsecret = clientsecret;
  }

  getPriceId()
  {
    return this.priceid;
  }

  getCustomerId()
  {
    return this.customerid;
  }

  getSubscriptionId()
  {
    return this.getSubscriptionId;
  }

  getClientSecret()
  {
    return this.getClientSecret;
  }
}
