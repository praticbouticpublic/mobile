import { HttpClient } from '@angular/common/http';
import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categorie, Article, Groupe, Image, Option } from '../model.enum';
import { OrderService } from '../order.service';
import { SessionfrontService } from '../sessionfront.service';
import { strings } from '../strings';
import { TypeMethod } from '../typemethod.enum';
import { TypeOrderline } from '../typeorderline.enum';
import { AlertController, MenuController, IonHeader, IonCard, IonImg, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, IonItem, IonTextarea, IonLabel, IonSelect, IonSelectOption, IonFooter } from '@ionic/angular/standalone';
import { Swiper } from 'swiper';
import { register } from 'swiper/element/bundle';
import { StorageService } from '../storage.service';
import {HeaderService} from "../header.service";
import { DecimalPipe } from '@angular/common';


register();

@Component({
    selector: 'app-carte',
    templateUrl: './carte.page.html',
    styleUrls: ['./carte.page.scss'],
    standalone: true,
    imports: [
        RouterLink,
        DecimalPipe,
        IonHeader,
        IonCard,
        IonImg,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSpinner,
        IonButton,
        IonItem,
        IonLabel,
        IonSelect,         // ajouté: nécessaire pour <ion-select> et ses inputs/outputs
        IonSelectOption,
        IonTextarea,       // ajouté: utilisé dans le template
        IonFooter
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class CartePage implements OnInit {

    heightfortheBottom = '0px';
    loadingState = true;
    method = TypeMethod.CLICKNCOLLECT;
    table = 1;
    logo = '';
    nom = '';
    srvroot= environment.srvroot;
    apiroot = environment.apiroot;
    mntcmdmini = 0;
    sizeimg = '';
    categories: Categorie[] = new Array();
    articles: Article[] = new Array();
    images: Image[] = new Array();
    groupes: Groupe[] = new Array();
    somme = 0;
    nocat = 0;
    noart: number[] = new Array();
    nogrp = 0;
    swiper!: Swiper;

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    constructor(private httpClient: HttpClient, private alert: AlertController, private router: Router, private route: ActivatedRoute,
        private order: OrderService, private session: SessionfrontService, public menuCtrl: MenuController,
        public storage: StorageService, public header:HeaderService) {

    }

    getShowBarre(): boolean {
        return (sessionStorage.getItem('barre') !== 'fermer');
    }

    setShowBarre(etat: boolean) {
        sessionStorage.setItem('barre', etat ? 'fermer' : '');
    }


    ngOnInit(): void {
      this.menuCtrl.isOpen().then(data => {
        if (!data) {
          this.menuCtrl.enable(false);
        }
      });
      this.session.getLogo().then(logo => {
        this.logo = logo;
        this.session.getMethod().then(method => {
          this.method = method;
          this.session.getNomBoutic().then(nomboutic => {
	    this.nom = nomboutic;
            this.session.getBouticId().then(async bouticid => {
              this.getSession(bouticid).then(()=> {
                  this.totaliser();
                  this.loadingState = false;
              });
            });
          });
        });
      });
    }

    async getSession(bouticid: number) {
        let objBouticGS = { requete: "getSession" };
        this.httpClient.post<any>(environment.apiroot + 'front', objBouticGS, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.header.setToken(data[0].body.token);
                this.session.setMethod(+data[0].body.method);
                this.session.setTable(+data[0].body.table);
                this.getParamMntCmdMin(bouticid);
            },
            error: (err: any) => this.presentErrAlert(strings.ErrConnect, err.error.error)
        });
    }


    async getParamMntCmdMin(bouticid: number) {
        const objmntcmdmini = { bouticid, requete:'getparam', param: "MntCmdMini" };
        this.httpClient.post<any>(environment.apiroot + 'front', objmntcmdmini, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.mntcmdmini = data[0];
                this.getParamSizeImg(bouticid);
            },
            error: (err: any) => this.presentErrAlert(strings.ErrConnect, err.error.error)
        });
    }

    async getParamSizeImg(bouticid: number) {
        const objsizeimg = { bouticid, requete:'getparam' , param: "SIZE_IMG" };
        this.httpClient.post<any>(environment.apiroot + 'front', objsizeimg, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.sizeimg = data[0];
                this.getCategories(bouticid);
            },
            error: (err: any) => this.presentErrAlert(strings.ErrConnect, err.error.error)
        });
    }


    async getCategories(bouticid: number) {
        let objcat = { bouticid, requete: "categories" };
        this.httpClient.post<Categorie[]>(environment.apiroot + 'front', objcat, await this.header.buildHttpOptions()).pipe(
            map((categories: any) => {
                return categories.map((categorie: any) => {
                    return { id: +categorie[0], nom: categorie[1], active: !!+categorie[2], open: true };
                });
            })
        ).subscribe({
            next: (categories: Categorie[]) => {
                this.categories = categories;
                for (let cat of categories)
                    this.getArticles(bouticid, cat);
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err.error.error);
            }
        });
    }

    async getArticles(bouticid: number, categorie: Categorie) {
        let objart = { bouticid, requete: 'articles', catid: categorie.id };
        this.httpClient.post<Article[]>(environment.apiroot + 'front', objart, await this.header.buildHttpOptions()).pipe(
            switchMap((articles: any) => {
                const articlesWithPromisesResolved = articles.map(async (article: any) => {
                    const qte = await this.getStoredQte(+article[0]);
                    const current = await this.getStoredCur(+article[0]);
                    return {
                        id: +article[0], nom: article[1], prix: +article[2], unite: article[3], description: article[4],
                        categorie, image: article[5], qte, listimg: new Array(), groupes: new Array(), current
                    };
                });
                return forkJoin(articlesWithPromisesResolved);
            })
        ).subscribe({
            next: (articles: Article[]) => {

                for (let art of articles)
                {
                    this.articles.push(art);
                    this.getImages(bouticid, art).then(() => {
                        this.getGroupes( bouticid, art);
                    });
                }
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err.error.error);
            }
        });
    }

    async getImages( bouticid: number, article: Article) {
        let objimg = { bouticid, requete: 'images', artid: article.id };
        this.httpClient.post<Image[]>(environment.apiroot + 'front', objimg, await this.header.buildHttpOptions()).pipe(
            map((images: any) => {
                return images.map((image: any) => {
                    let count = 0;
                    return { artid: article.id, image:image.image, loaded: false };
                    count++;
                });
            })
        ).subscribe({
            next: (images: Image[]) => {
                article.listimg = images;
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err.error.error);
            }
        });
    }

    async getGroupes( bouticid: number, article: Article) {
        let objgrp = { bouticid, requete: 'groupesoptions', artid: article.id };
        this.httpClient.post<Groupe[]>(environment.apiroot + 'front', objgrp, await this.header.buildHttpOptions()).pipe(
            map((groupes: any) => {
                return groupes.map((groupe: any) => {
                    return { id: +groupe[0], nom: groupe[1], multi: !!+groupe[2], options: new Array(), selection: new Array() };
                });
            })
        ).subscribe({
            next: (groupes: Groupe[]) => {
                article.groupes = groupes;
                forkJoin(groupes.map(grp => this.getOptions(bouticid, grp, article)));
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err.error.error);
            }
        });
    }

    async getOptions(bouticid: number, grp: Groupe, art : Article) {
        let objopt = { requete: 'options', grpoptid: grp.id };
        this.httpClient.post<Option[]>(environment.apiroot + 'front', objopt, await this.header.buildHttpOptions()).pipe(
            map((options: any) => {
                return options.map((option: any) => {
                    return { id: +option[0], nom: option[1], surcout: +option[2], selected: false };
                });
            })
        ).subscribe({
            next: (options: Option[]) => {
                grp.options = options;
                if (art.qte) {
                    for (let cur = 1; cur <= art.qte; cur++) {
                        if (grp.options.length > 0) {
                            this.getStoredGrpSel(art.id, grp.id, cur).then(optsel => {
                                if (grp.multi)
                                    grp.selection[cur - 1] = optsel as number[];
                                else {
                                    if (!(optsel as number))
                                        grp.selection[cur - 1] = options[0].id;
                                    else
                                        grp.selection[cur - 1] = optsel;
                                }

                            });
                        }
                    }
                }
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err.error.error);
            }
        });
    }

    addQt(art: Article) {
        art.qte++;
        art.groupes.forEach((grp) => {
            if ((!grp.multi) && (grp.options.length > 0)) {
                grp.selection[(art.qte - 1)] = grp.options[0].id;
                this.storage.set('artid' + art.id + 'grpid' + grp.id + 'cur' + (art.qte - 1), String(grp.options[0].id));
            }
        });
        if (art.current < 1) {
            art.current = 1;
            this.setStoredCur(art.id, art.current);
        }
        this.setStoredQte(art.id, art.qte);
        this.totaliser();
    }

    subQt(art: Article) {
        if (art.qte > 0) {
            art.qte--;
            this.setStoredQte(art.id, art.qte);
            art.groupes.forEach((grp) => {
                grp.selection.pop();
                sessionStorage.removeItem('artid' + art.id + 'grpid' + grp.id + 'cur' + art.current);
            });
            art.current = art.qte;
            this.setStoredCur(art.id, art.current);

        }
        this.totaliser();
    }

    totaliser() {
        this.somme = 0;
        this.articles.forEach((art) => {
            this.somme = this.somme + (art.qte * art.prix);
            art.groupes.forEach((grp) => {
                grp.selection.forEach((sel) => {
                    for (let s of this.toArray(sel))
                        grp.options.forEach((opt) =>
                            this.somme += ((+s === opt.id) ? (opt.surcout) : 0));
                })
            })
        })
    }

    setNewValue(event: any, art: Article, idxgrp: number, idx: number) {
        const val = event.target.value;
        if (art.groupes[idxgrp].multi)
            art.groupes[idxgrp].selection[idx - 1] = val as number[];
        else
            art.groupes[idxgrp].selection[idx - 1] = val as number;
        this.setStoredGrpSel(art.id, art.groupes[idxgrp].id, idx, val);
        this.totaliser();
    }

    setart(art: Article, val: number) {
        art.current = art.current + val;
        this.setStoredCur(art.id, art.current);
    }

    Poursuivre() {
        if (this.somme >= this.mntcmdmini) {
            this.enregistrerlacommande();
            this.router.navigate(['admin/getinfo'], { replaceUrl: true })
        }
        else {
            this.presentAlert(strings.CantContinue, strings.MntCmdMiniErr);
        }
    }

    enregistrerlacommande() {
        this.order.setOrderLenght(0);
        this.articles.forEach((art) => {
            let options = '';
            art.groupes.forEach((grp) => {
                grp.selection.forEach((sel) => {
                    for (let s of this.toArray(sel))
                        grp.options.forEach((opt) =>
                            options += ((+s === opt.id) ? ((grp.multi ? ' + ' : ' / ') + opt.nom) : ''));
                })
            })
            options += '\n';
            if (art.qte)
                this.order.addOrderline(String(art.id), TypeOrderline.article, art.nom, String(art.prix), String(art.qte), art.unite, options, art.description);
            art.groupes.forEach((grp) => {
                grp.selection.forEach((sel) => {
                    for (let s of this.toArray(sel))
                        grp.options.forEach((opt) => {
                            if (+s === opt.id)
                                this.order.addOrderline(String(opt.id), TypeOrderline.option, opt.nom, String(opt.surcout), '1', art.unite, '', '');
                        })
                })
            })
        })
        this.order.setSousTotal(this.somme);
        this.order.setArticles(this.articles);
        this.order.Enregistrement();
    }

    toArray(n: any): Array<any> {
        let arr = Array();
        if (!n.length) {
            arr.push(n);
            return arr;
        }
        else
            return n;
    }

    getStoredQte(artid: number): Promise<number> {
        return this.storage.get('artid' + artid + 'qte').then(qte => {
            return ((qte !== null) ? +qte : 0);
        });
    }

    setStoredQte(artid: number, qte: number) {
        this.storage.set('artid' + artid + 'qte', String(qte));
    }

    async getStoredCur(artid: number): Promise<number> {
        const cur = await this.storage.get('artid' + artid + 'cur');
        return ((cur !== null) ? +cur : 0);
    }

    setStoredCur(artid: number, cur: number) {
        this.storage.set('artid' + artid + 'cur', String(cur));
    }

    async getStoredGrpSel(artid: number, grpid: number, cur: number): Promise<any> {
        const sele = await this.storage.get('artid' + artid + 'grpid' + grpid + 'cur' + cur);
        return ((sele !== null) ? JSON.parse(sele) : '');
    }

    setStoredGrpSel(artid: number, grpid: number, cur: number, selection: any) {
        this.storage.set('artid' + artid + 'grpid' + grpid + 'cur' + cur, JSON.stringify(selection));
    }


    async presentAlert(header: string, message: string): Promise<void> {
        const alert = await this.alert.create({
            header,
            message,
            buttons: ['OK'],
        });
        await alert.present();
    }

    async presentConfirmationAlert(): Promise<void> {
        const alert = await this.alert.create({
            header: strings.Error,
            message: strings.NoBoutic,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.router.navigate(['admin/welcome'], { replaceUrl: true });
                    }
                }
            ],
        });
        await alert.present();
    }

    async presentErrAlert(header: string, message: string): Promise<void> {
        this.session.getAliasBoutic(true).then(async aliasboutic => {
            this.session.getMethod(true).then(async method => {
                this.session.getTable(true).then(async table => {
                    const alert = await this.alert.create({
                        header,
                        message,
                        buttons: [
                            {
                                text: 'OK',
                                handler: data => {
                                    this.router.navigate(['admin/debut/' + aliasboutic + '/' + method + '/' + table], { replaceUrl: true })
                                }
                            }
                        ],
                    });
                    await alert.present();
                });
            });
        });
    };

}
