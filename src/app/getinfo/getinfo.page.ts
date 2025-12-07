import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {AlertController, IonTitle, IonToolbar, MenuController} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderService } from '../order.service';
import { SessionfrontService } from '../sessionfront.service';
import { strings } from '../strings';
import { TypeMethod } from '../typemethod.enum';
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe, NgClass} from "@angular/common";

@Component({
    selector: 'app-getinfo',
    templateUrl: './getinfo.page.html',
    styleUrls: ['./getinfo.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule, RouterLink, DecimalPipe, NgClass]
})
export class GetinfoPage implements OnInit {

    nomclient = '';
    adrclient = '';
    bouticid = 0;
    aliasboutic = '';
    chm = '';
    cmemp = '';
    cmlivr = '';
    chp = '';
    cmpt = '';
    livr = '';
    verifcp = false;
    method = 0;
    inrange = 'ok';
    heightfortheBottom = '0px';
    sstotal = 0;
    showadrlivr = false;
    logo = '';
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    loadingState = true;
    frais: number | null = null;
    rem: number | null = null;
    nom = '';

    getinfoFormGroup!: FormGroup;

    constructor(public httpClient: HttpClient, public alert: AlertController, public router: Router, public route: ActivatedRoute,
        public order: OrderService, public session: SessionfrontService, public fb: FormBuilder,
        public menuCtrl: MenuController, public header:HeaderService) {

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

        this.getinfoFormGroup = this.fb.group({
            clnom: ['', [Validators.required, Validators.maxLength(60)]],
            clprenom: ['', [Validators.required, Validators.maxLength(60)]],
            cltel: ['', [Validators.required, Validators.pattern('(^(?:0|\\(?\\+33\\)?\\s?|0033\\s?)[0-9](?:[\\.\\-\\s]?\\d\\d){4}$)')]],
            vente: ['', [Validators.required]],
            adrlivr: this.fb.group({
                ligne1: ['', [Validators.required, Validators.maxLength(150)]],
                ligne2: ['', [Validators.maxLength(150)]],
                codepostal: ['', [Validators.required, Validators.pattern('[0-9]{5}'), Validators.maxLength(5)]],
                ville: ['', [Validators.required, Validators.maxLength(50)]]
            }),
            paiement: ['', [Validators.required]],
            codepromo: ['', [Validators.pattern('[0-9A-Z]{8}')]],
            cgv: [false, [Validators.required]],
            infosup: ['', []]
        });

        this.session.getAliasBoutic().then(aliasboutic => {
            this.aliasboutic = aliasboutic;
            this.session.getBouticId().then(bouticid => {
                this.bouticid = bouticid;
                this.session.getLogo().then(logo => {
                    this.logo = logo;
                    this.session.getMethod().then(method => {
                        this.method = method;
                        this.order.getSousTotal().then(soustotal => {
                            this.sstotal = soustotal;
                            this.session.getNomBoutic().then(nomboutic => {
                                this.nom = nomboutic;
                                this.order.getNom().then(clnom => {
                                    this.getinfoFormGroup.get('clnom').setValue(clnom);
                                    this.order.getPrenom().then(clprenom => {
                                        this.getinfoFormGroup.get('clprenom').setValue(clprenom);
                                        this.order.getTelephone().then(cltel => {
                                            this.getinfoFormGroup.get('cltel').setValue(cltel);
                                            this.order.getVente().then(vente => {
                                                this.getinfoFormGroup.get('vente').setValue(vente);
                                                this.order.getAdr1().then(adr1 => {
                                                    this.getinfoFormGroup.controls.adrlivr.get('ligne1').setValue(adr1);
                                                    this.order.getAdr2().then(adr2 => {
                                                        this.getinfoFormGroup.controls.adrlivr.get('ligne2').setValue(adr2);
                                                        this.order.getCodePostal().then(codepostal => {
                                                            this.getinfoFormGroup.controls.adrlivr.get('codepostal').setValue(codepostal);
                                                            this.order.getVille().then(ville => {
                                                                this.getinfoFormGroup.controls.adrlivr.get('ville').setValue(ville);
                                                                this.order.getPaiement().then(paiement => {
                                                                    this.getinfoFormGroup.get('paiement').setValue(paiement);
                                                                    this.order.getCodePromo().then(codepromo => {
                                                                        this.getinfoFormGroup.get('codepromo').setValue(codepromo);
                                                                        this.order.getInfoSup().then(infosup => {
                                                                            this.getinfoFormGroup.get('infosup').setValue(infosup);
                                                                                this.getRemise();
                                                                                this.getClientInfo();
                                                                                if (this.method === TypeMethod.ATABLE) {
                                                                                    this.getinfoFormGroup.get('clnom')?.disable();
                                                                                    this.getinfoFormGroup.get('clprenom')?.disable();
                                                                                    this.getinfoFormGroup.get('vente')?.disable();
                                                                                    this.getinfoFormGroup.get('paiement')?.disable();
                                                                                }

                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                })
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    async getClientInfo() {
        const objbouticinf = { requete: "getClientInfo", customer: this.aliasboutic };
        this.httpClient.post<string[]>(environment.apiroot + 'front', objbouticinf, await this.header.buildHttpOptions()).subscribe({
            next: async (data: any) => {
                this.nomclient = data[1];
                this.adrclient = data[2];
                (await this.getParam(this.bouticid, 'Choix_Method')).subscribe({
                    next: async (data: string) => {
                        this.chm = (data[0] !== null) ? data[0] : 'TOUS';
                        this.order.setVente(this.chm);
                        this.getinfoFormGroup.get('vente')?.setValue(this.chm);
                        this.showadrlivr = (this.getinfoFormGroup.get('vente')?.value === "LIVRER");
                        this.eraseAdrLivr(!this.showadrlivr);
                        if (this.showadrlivr && (this.method !== TypeMethod.ATABLE))
                            this.getFraisLivraison();
                        (await this.getParam(this.bouticid, 'CM_Emporter')).subscribe({
                            next: async (data: string) => {
                                this.cmemp = (data[0] !== null) ? data[0] : 'Retrait Standard';
                                (await this.getParam(this.bouticid, 'CM_Livrer')).subscribe({
                                    next: async (data: string) => {
                                        this.cmlivr = (data[0] !== null) ? data[0] : 'Livraison Standard';
                                        (await this.getParam(this.bouticid, 'Choix_Paiement')).subscribe({
                                            next: async (data: string) => {
                                                this.chp = (data[0] !== null) ? data[0] : 'TOUS';
                                                this.order.setPaiement(this.chp);
                                                this.getinfoFormGroup.get('paiement')?.setValue(this.chp);
                                                (await this.getParam(this.bouticid, 'MP_Comptant')).subscribe({
                                                    next: async (data: string) => {
                                                        this.cmpt = (data[0] !== null) ? data[0] : 'Prochain écran par CB';
                                                        (await this.getParam(this.bouticid, 'MP_Livraison')).subscribe({
                                                            next: async (data: string) => {
                                                                this.livr = (data[0] !== null) ? data[0] : 'Paiement à la livraison';
                                                                (await this.getParam(this.bouticid, 'VerifCP')).subscribe({
                                                                    next: (data: string) => {
                                                                        this.verifcp = !!+((data[0] !== null) ? data[0] : '0');
                                                                        this.loadingState = false;
                                                                    },
                                                                    error: (err: any) => {this.presentErrAlert(strings.ErrConnect, err.error.error)}
                                                                })
                                                            },
                                                            error: (err: any) => {this.presentErrAlert(strings.ErrConnect, err.error.error)}
                                                        })
                                                    },
                                                    error: (err: any) => {this.presentErrAlert(strings.ErrConnect, err.error.error)}
                                                })
                                            },
                                            error: (err: any) => { void this.presentErrAlert(strings.ErrConnect, err.error.error); }
                                        })
                                    },
                                    error: (err: any) => void this.presentErrAlert(strings.ErrConnect, err.error.error)
                                })
                            },
                            error: (err: any) => void this.presentErrAlert(strings.ErrConnect, err.error.error)
                        })
                    },
                    error: (err: any) => void this.presentErrAlert(strings.ErrConnect, err.error.error)
                })
            },
            error: (err: any) => void this.presentErrAlert(strings.ErrConnect, err.error.error)
        });
    }

    async getParam(bouticid: number, nomparam: string): Promise<Observable<any>> {
        const objmntcmdmini = { requete: "getparam", bouticid, param: nomparam };
        return this.httpClient.post<string>(environment.apiroot + 'front', objmntcmdmini, await this.header.buildHttpOptions());
    }

    async checkcp() {
        let elem = this.getinfoFormGroup.get(['adrlivr', 'codepostal'])?.value;
        if (this.verifcp) {
            if (elem.length === 5) {
                let obj = { cp: elem, customer: this.aliasboutic };
                this.httpClient.post<string>(environment.apiroot + 'check-codepostal', obj, await this.header.buildHttpOptions()).subscribe({
                    next: (data: any) => this.inrange = data,
                    error: (err: any) => this.inrange = 'ko'
                });
            }
        }
        else {
            this.inrange = 'ok';
        }
    }

    async getFraisLivraison() {
        let obj = { sstotal: this.sstotal, customer: this.aliasboutic };
        this.httpClient.post<string>(environment.apiroot + 'frais-livr', obj, await this.header.buildHttpOptions()).subscribe({
            next: (response: any) => {
                if (+response.cost > 0) {
                    this.frais = +response.cost;
                    this.order.setFraisLivr(+response.cost);
                }
                else {
                    this.frais = null;
                    this.order.setFraisLivr(0);
                }
            },
            error: (err: any) => this.presentErrAlert(strings.ErrConnect, err.error.error)
        });
    }

    eraseAdrLivr(etat: boolean) {
        this.showadrlivr = !etat;
        etat ? this.getinfoFormGroup.get('adrlivr')?.disable() : this.getinfoFormGroup.get('adrlivr')?.enable();
        if (etat) {
            this.inrange = 'ok';
        } else {
            this.inrange = 'ko';
        }
    }


    // Appel asynchrone pour connaitre le cout de la livraison
    removeFraisLivraison() {
        this.frais = 0;
        this.order.setFraisLivr(0);
    }

    // Appel asynchrone pour connaitre le montant de la remise
    async getRemise() {

        let obj = {
            sstotal: this.sstotal,
            customer: this.aliasboutic,
            code: this.getinfoFormGroup.get('codepromo')?.value,
        };

        this.httpClient.post<string>(environment.apiroot + 'calcul-remise', obj, await this.header.buildHttpOptions()).subscribe({
            next: (response: any) => {
                if (+response.result > 0) {
                    this.rem = +response.result;
                    this.order.setRemise(+response.result);
                }
                else {
                    this.rem = null;
                    this.order.setRemise(0);
                }
            },
            error: (err: any) =>  {this.presentErrAlert(strings.ErrConnect, err.error.error);}
        });

    }

    Retour() {
        this.bakInfo()
        this.router.navigate(['admin/carte'], { replaceUrl: true });
    }

    onSubmit() {
        if (this.getinfoFormGroup.invalid) {
            return;
        }

        if ((this.inrange === 'ko') && (this.verifcp)) {
            this.presentAlert(strings.CantContinue, strings.NotInZone + ' : ' + this.adrclient);
            return;
        }

        if (this.getinfoFormGroup.get('cgv')?.value === true) {
            this.bakInfo();
            this.router.navigate(['admin/paiement'], { replaceUrl: true });
        }
        else
            this.presentAlert(strings.CantContinue, strings.RequireCGV);

    }

    bakInfo() {
        this.order.setNom(this.getinfoFormGroup.get('clnom')?.value);
        this.order.setPrenom(this.getinfoFormGroup.get('clprenom')?.value);
        this.order.setTelephone(this.getinfoFormGroup.get('cltel')?.value);
        if (this.chm === 'TOUS')
            this.order.setVente(this.getinfoFormGroup.get('vente')?.value);
        this.order.setAdr1(this.getinfoFormGroup.get('adrlivr.ligne1')?.value);
        this.order.setAdr2(this.getinfoFormGroup.get('adrlivr.ligne2')?.value);
        this.order.setCodePostal(this.getinfoFormGroup.get('adrlivr.codepostal')?.value);
        this.order.setVille(this.getinfoFormGroup.get('adrlivr.ville')?.value);
        if (this.chp === 'TOUS')
            this.order.setPaiement(this.getinfoFormGroup.get('paiement')?.value);
        this.order.setCodePromo(this.getinfoFormGroup.get('codepromo')?.value);
        this.order.setInfoSup(this.getinfoFormGroup.get('infosup')?.value);
    }

    gotoCGV() {
        this.bakInfo();
        this.router.navigate(['admin/termsandconditions/front'], { replaceUrl: true });
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
        const alert = await this.alert.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.router.navigate([this.session.getAliasBoutic(true) + '/' + this.session.getMethod(true) + '/' + this.session.getTable(true)], { replaceUrl: true })
                    }
                }
            ],
        });
        await alert.present();
    }

    onModelChange(event: any) {
        if (event.target.value === 'EMPORTER') {
            this.eraseAdrLivr(true);
            this.removeFraisLivraison();
        }
        else {
            this.eraseAdrLivr(false);
            this.getFraisLivraison();
        }
    }
}
