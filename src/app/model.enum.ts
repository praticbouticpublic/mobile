export interface Boutic 
{
  id: number;
  alias: string;
  nom: string;
  logo: string;
  stripecustomerid:string;
}

export interface Categorie 
{
  id: number;
  nom: string;
  active: boolean;
  open: boolean;
}

export interface Article 
{
  id: number;
  nom: string;
  prix: number;
  description: string;
  categorie: Categorie;
  unite: string;
  image: string;
  qte: number;
  listimg : Image[];
  groupes: Groupe[];
  current: number;
}

export interface Image
{
  artid: number;
  image: string;
  loaded: boolean;
}

export interface Groupe
{
  id: number;
  nom: string;
  multi: boolean;
  options: Option[];
  selection: (Array<number> | number)[];
}

export interface Option
{
  id: number;
  nom: string;
  surcout: number;
  selected : boolean;
}
