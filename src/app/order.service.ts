import { Injectable } from '@angular/core';
import { TypeOrderline } from 'src/app/typeorderline.enum'
import { Article, Groupe } from 'src/app/model.enum';
import { StorageService } from './storage.service';

export interface Orderline
{
  id: string;
  type: TypeOrderline;
  name: string;
  prix: string;
  qt: string;
  unite: string;
  opts: string;
  txta : string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order: Orderline [] = new Array();
  total = 0;
  fraisLivr = 0;
  remise = 0;
  nom = '';
  prenom = '';
  telephone = '';
  vente = '';
  adr1 = '';
  adr2 = '';
  codepostal = '';
  ville = '';
  paiement = '';
  codepromo = '';
  infosup = '';
  articles: Article[] = new Array();

  constructor(public storage:StorageService) { }

  addOrderline(id: string, type: TypeOrderline, name: string, prix: string, qt: string, unite: string , opts: string, txta: string)
  {
    this.order.push({id, type, name, prix, qt, unite, opts, txta});
  }

  getOrderline(index: number): Orderline
  {
    return this.order[index];
  }

  setOrderLenght(val: number)
  {
    this.order.length = val;
  }

  getOrderLenght()
  {
    return this.order.length;
  }

  razOrder()
  {
    this.order.length = 0;
    this.storage.remove('commande');
    this.setSousTotal(0);
    this.storage.remove('soustotal');
    this.setFraisLivr(0);
    this.storage.remove('fraislivr');
    this.setRemise(0);
    this.storage.remove('remise');
    this.setNom('');
    this.storage.remove('nom');
    this.setPrenom('');
    this.storage.remove('prenom');
    this.setTelephone('');
    this.storage.remove('telephone');
    this.setVente('');
    this.storage.remove('vente');
    this.setAdr1('');
    this.storage.remove('adr1');
    this.setAdr2('');
    this.storage.remove('adr2');
    this.setCodePostal('');
    this.storage.remove('codepostal');
    this.setVille('');
    this.storage.remove('ville');
    this.setPaiement('');
    this.storage.remove('paiement');
    this.setCodePromo('');
    this.storage.remove('codepromo');
    this.setInfoSup('');
    this.storage.remove('infosup');
  }

  getSousTotal(useStorage:boolean = true) : Promise<number>
  {
    return this.storage.get('soustotal').then( soustotal => {
      return (useStorage ? +String(soustotal ?? '0') : this.total);
    });
  }

  setSousTotal(valeur: number)
  {
    this.storage.set('soustotal', String(valeur));
    this.total = valeur;
  }

  getFraisLivr(useStorage:boolean = true): Promise<number>
  {
    return this.storage.get('fraislivr').then( fraislivr => {
      return (useStorage ? +String(fraislivr ?? '0') : this.fraisLivr);
    });
  }

  setFraisLivr(valeur: number)
  {
    this.storage.set('fraislivr', String(valeur));
    this.fraisLivr = valeur;
  }

  getRemise(useStorage:boolean = true): Promise<number>
  {
    return this.storage.get('remise').then( remise => {
      return (useStorage ? +String(remise ?? '0') : this.remise);
    });
  }

  setRemise(valeur: number)
  {
    this.storage.set('remise', String(valeur));
    this.remise = valeur;
  }

  Enregistrement()
  {
    this.storage.set('soustotal', String(this.total));
    this.storage.set('commande', JSON.stringify(this.order));
  }

  getCommande() : Promise<Orderline[]>
  {
    return this.storage.get('commande').then( commande => {
      if (commande !== null)
        return JSON.parse(commande);
      else
        return new Array;
    });

  }

  getNom(useStorage:boolean = true) : Promise<string>
  {
    return this.storage.get('nom').then( nom =>{
      return (useStorage ? nom : this.nom);
    });

  }

  setNom(valeur:string)
  {
    this.storage.set('nom', valeur !== null ? valeur : '');
    this.nom = valeur;
  }

  getPrenom(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('prenom').then( prenom => {
      return (useStorage ? prenom : this.prenom);
    });
  }

  setPrenom(valeur:string)
  {
    this.storage.set('prenom', valeur !== null ? valeur : '');
    this.prenom = valeur;
  }

  getTelephone(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('telephone').then( telephone => {
      return (useStorage ? telephone : this.telephone);
    });
  }

  setTelephone(valeur:string)
  {
    this.storage.set('telephone', valeur !== null ? valeur : '');
    this.telephone = valeur;
  }

  getVente(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('vente').then( vente => {
      return (useStorage ? vente : this.vente);
    });
  }

  setVente(valeur:string)
  {
    this.storage.set('vente', valeur !== null ? valeur : '');
    this.vente = valeur;
  }

  getAdr1(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('adr1').then( adr1 => {
      return (useStorage ? adr1 : this.adr1);
    });
  }

  setAdr1(valeur:string)
  {
    this.storage.set('adr1', valeur !== null ? valeur : '');
    this.adr1 = valeur;
  }

  getAdr2(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('adr2').then( adr2 => {
      return (useStorage ? adr2 : this.adr2);
    });
  }

  setAdr2(valeur:string)
  {
    this.storage.set('adr2', valeur !== null ? valeur : '' );
    this.adr2 = valeur;
  }

  getCodePostal(useStorage:boolean = true) : Promise<string>
  {
    return this.storage.get('codepostal').then( codepostal => {
      return (useStorage ? codepostal : this.codepostal);
    });
}

  setCodePostal(valeur:string)
  {
    this.storage.set('codepostal', String(valeur !== null ? valeur : ''));
    this.codepostal = valeur;
  }

  getVille(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('ville').then( ville => {
      return (useStorage ? ville : this.ville);
    });
  }

  setVille(valeur:string)
  {
    this.storage.set('ville', valeur !== null ? valeur : '');
    this.ville = valeur;
  }

  getPaiement(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('paiement').then( paiement => {
      return (useStorage ? paiement : this.paiement);
    });
  }

  setPaiement(valeur:string)
  {
    this.storage.set('paiement', valeur !== null ? valeur : '');
    this.paiement = valeur;
  }

  getCodePromo(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('codepromo').then( codepromo => {
      return (useStorage ? codepromo : this.codepromo);
    });
  }

  setCodePromo(valeur:string)
  {
    this.storage.set('codepromo', valeur !== null ? valeur : '');
    this.codepromo = valeur;
  }

  getInfoSup(useStorage:boolean = true): Promise<string>
  {
    return this.storage.get('infosup').then( infosup => {
      return (useStorage ? infosup : this.infosup);
    });
  }

  setInfoSup(valeur:string)
  {
    this.storage.set('infosup', valeur !== null ? valeur : '');
    this.infosup = valeur;
  }

  setArticles(articles: Article[])
  {
    this.articles = articles;
  }

  removeMemControl()
  {
      this.articles.forEach((art:Article) => {
          this.storage.remove('artid' + art.id + 'qte');
          this.storage.remove('artid' + art.id + 'cur');
              art.groupes.forEach((groupe:Groupe)=> {
                  for(let cur = 1; cur<=art.qte; cur++)
                  {
                      this.storage.remove('artid' + art.id + 'grpid' + groupe.id + 'cur' + cur);
                  }
          });

      });
  }

}
