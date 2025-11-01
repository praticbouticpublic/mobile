import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {strings} from "./strings";
import {ModeleService} from "./modele.service";
import {StorageService} from "./storage.service";
import {GetbackService} from "./getback.service";
import {Router} from "@angular/router";
import {SelparamService} from "./selparam.service";
import {AlertController} from "@ionic/angular/standalone";
import {environment} from "../environments/environment";
import {HeaderService} from "./header.service";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "./global.service";
import iro from "@jaames/iro";


interface recimage {
    pkid: number;
    bouticid: number;
    artid: number;
    filename: string;
    favori: boolean;
    visible: boolean;
}

export abstract class  SubmitBase {

    isSubmitted = false;
    form: FormGroup;
    loading = true;
    champs: any;
    imgtruefilename = '';
    selcol = '';
    selid = 0;
    bouticid: any;
    numtable: any;
    static listimg: recimage[] = new Array();
    static listimgvis: recimage[] = new Array();
    imagesrc ='';
    colorpicker: any = null;
    valeurs: any[];
    liste: any[][] = new Array();
    nomliens: any[];


    input_action: string;
    input_table: string;
    input_selcol: string;
    input_selid: number;
    input_id: number;

    row: any[] = [];

    protected constructor(public model: ModeleService, public storage: StorageService, public getback:GetbackService,
                          public router: Router, public selparam: SelparamService, public alertController: AlertController,
                          public httpClient: HttpClient, public header: HeaderService, public global: GlobalService,
                          public formAction: FormBuilder)
    {
        this.form = this.formAction.group({});


    }

    get errorControl() {
        return this.form.controls;
    }

    errorControlfield(index: any) {
        return this.form.get(index);
    }


    async initialize()
    {
            this.numtable = this.model.getnumtable(this.input_table);
            this.champs = this.model.getTable(this.numtable).champs;
            for (let h = 0; h < this.champs.length; h++) {
                this.form.addControl(h.toString(), new FormControl());
            }
            SubmitBase.listimg = [];
            SubmitBase.listimgvis = [];
            this.storage.get('mem_bouticid').then(mbouticid => {
                this.storage.get('mem_operation').then(op => {
                    this.storage.get('mem_table').then(table => {
                        this.storage.get('mem_idtoup').then(idtoup => {
                            this.storage.get('mem_selcol').then(selcol => {
                                this.storage.get('mem_selid').then(selid => {
                                    this.storage.get('bouticid').then(async bouticid => {
                                        this.bouticid = bouticid;
                                        if (table !== null) {
                                            if ((bouticid !== this.bouticid) || (op !== this.input_action) || (table !== this.input_table) || (+idtoup !== this.input_id) ||
                                                (selcol !== this.selcol) || (+selid !== this.selid)) {
                                                for (let ij = 0; ij < this.model.getTable(this.numtable).champs.length; ij++) {
                                                    this.storage.remove('mem_fld_' + ij);
                                                }
                                            }
                                        }
                                        this.storage.set('mem_bouticid', this.bouticid);
                                        this.storage.set('mem_operation', this.input_action);
                                        this.storage.set('mem_table', this.input_table);
                                        this.storage.set('mem_idtoup', this.input_id);
                                        this.storage.set('mem_selcol', this.input_selcol);
                                        this.storage.set('mem_selid', this.input_selid);

                                        await this.genValeursLiens();

                                        await this.genValeursparDefaut();



                                        if ((this.input_table === 'article') && (this.input_action === 'update'))
                                        {
                                            (await (((this.model.getData(this.bouticid, "artlistimg", environment.maximage, 0, "artid", this.input_id, null))))).subscribe({
                                                next: (data: any) => {
                                                    for (let di of data.data)
                                                    {
                                                        let img = {
                                                            pkid: +di[0],
                                                            artid: this.input_id,
                                                            bouticid: +this.bouticid,
                                                            filename: di[2],
                                                            favori: (di[3].toString() === '1'),
                                                            visible: (di[4].toString() === '1')
                                                        };
                                                        if (img.visible === true) {
                                                            SubmitBase.listimgvis.push(img as recimage);
                                                            SubmitBase.listimg.push(img as recimage);
                                                        }
                                                    }
                                                }, error: (err: any) => {
                                                    this.presentAlert(err.error.error);
                                                    this.reconnect();
                                                }
                                            });
                                        }
                                        this.loading = false;


                                    });
                                });
                            });
                        });
                    });
                });
            });
    }

    async genValeursLiens()
    {
        let i = -1;
        this.liste = new Array(this.champs.length);
        this.nomliens = new Array(this.champs.length);
        this.valeurs = new Array(this.champs.length);
        for (const ch of this.champs) {
            i++;
            this.liste[i] = new Array();
            if (ch.typ === 'fk') {
                for (const element of this.model.getLiens()) {
                    if ((element.srctbl === this.model.getTable(this.numtable).nom) && (element.srcfld === this.champs[i].nom)) {
                        this.nomliens[i] = element.desc;
                        for (const tbl of this.model.getTables()) {
                            if (tbl.nom === element.dsttbl) {
                                const ii = i;
                                const obj = {
                                    bouticid: this.bouticid,
                                    table: tbl.nom,
                                    colonne: tbl.cs + ((element.nom === 'statut') ? ', couleur' : '')
                                };

                                this.httpClient.post<any>(environment.apiroot + 'remplir-options', obj, await this.header.buildHttpOptions()).subscribe({
                                    next: async (data: any) => {
                                        let l = -1;
                                        let k = -1;
                                        for (const donnee of (data.results as any[])) {
                                            l++;
                                            this.liste[ii].push(new Object({
                                                id: donnee[0], valeur: donnee[1],
                                                couleur: (donnee.length > 2) ? donnee[2] : null
                                            }));
                                            if (donnee.length > 2) {
                                                k++;
                                                const css = '.optbackcolor' + k + '{background-color:' + donnee[2] + '; color: ' + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const css2 = '.optbackcolor' + k + ' > div.alert-button-inner > div.alert-radio-label { background-color:' + donnee[2] + '; color: '
                                                    + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const head = document.getElementsByTagName('head')[0];
                                                const style = document.createElement('style');
                                                //style.type = 'text/css';
                                                style.appendChild(document.createTextNode(css));
                                                style.appendChild(document.createTextNode(css2));
                                                head.appendChild(style);

                                            }
                                        }

                                    },
                                    error: (err: any) => this.reconnect()
                                });
                            }
                        }
                    }
                }

            }
            else {
                this.nomliens[i] = ch.desc;
            }
        }

        const obj2 = { bouticid: this.bouticid, table: this.model.getTable(this.numtable).nom, colonne: '', row: '', idtoup: this.input_id };

        this.httpClient.post<any>(environment.apiroot +  'get-values', obj2, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                let i = -1;
                for (let champ of this.champs) {
                    i++;
                    switch (champ.typ) {
                        case 'text':
                        case 'ref':
                        case 'image':
                        case 'pass':
                        case 'email':
                        case 'codepostal':
                        case 'couleur':
                            this.valeurs[i] = data.values[i];
                            break;
                        case 'date':
                            const event = new Date(Date.parse(data.values[i]));
                            this.valeurs[i] = event.toLocaleString('fr-FR');
                            break;
                        case 'bool':
                            this.valeurs[i] = (data.values[i] === '1') ? 'oui' : 'non';
                            break;
                        case 'prix':
                            this.valeurs[i] = parseFloat(data.values[i]).toFixed(2) + ' €';
                            break;
                        case 'fk':
                            for (let lien of this.model.getLiens()) {
                                if ((lien.srctbl === this.model.getTable(this.numtable).nom) && (lien.srcfld === champ.nom)) {
                                    for (let list of this.liste[i]) {
                                        if (list.id === data.values[i]) {
                                            this.valeurs[i] = list;
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }



            },
            error: (err: any) => {
                this.reconnect();
            }
        });


    }



    async genValeursparDefaut()
    {
        this.storage.get('bouticid').then(async bouticid => {
            const obj = {
                bouticid, action: 'getvalues', table: this.model.getTable(this.numtable).nom, colonne: '',
                row: '', idtoup: this.input_id
            };
            this.httpClient.post(environment.apiroot + 'get-values', obj, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {

                    let k = -1;
                    for (const champ of this.champs) {
                        k++;
                        const l = k;
                        if (champ.typ !== 'pk') {
                            this.storage.get('mem_fld_' + l).then(defval => {
                                if (defval === null) {
                                    switch (this.input_action) {
                                        case 'insert':
                                            defval = champ.defval;
                                            break;
                                        case 'view':
                                        case 'update':
                                            defval = data.values[l];
                                            break;
                                    }

                                }
                                if (champ.typ === 'image') {
                                    if ((defval !== null) && (defval !== '')) {
                                        this.imagesrc = environment.srvroot + 'upload/' + defval;
                                        this.imgtruefilename = defval;
                                        this.storage.set('mem_fld_' + l, defval);
                                    }
                                    else {
                                        this.imagesrc = '';
                                        this.imgtruefilename = '';
                                        this.storage.remove('mem_fld_' + l);
                                    }
                                }
                                else if (defval !== null)
                                {
                                    if (champ.typ === 'bool')
                                    {
                                        this.form.get(l.toString())?.setValue((defval.toString() === '1'));
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                    }
                                    else if (champ.typ === 'fk')
                                    {
                                        if (this.input_selcol !== champ.nom) {
                                            this.form.get(l.toString())?.setValue(defval);
                                            this.form.setErrors({ required: true });
                                            this.form.get(l.toString())?.addValidators([Validators.required]);
                                            this.form.get(l.toString())?.updateValueAndValidity();
                                        }
                                    }
                                    else if (champ.typ === 'couleur')
                                    {
                                        this.form.get(l.toString())?.setValue(defval);
                                        this.form.get(l.toString())?.addValidators([Validators.required]);
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                        const coul = (defval !== '') ? defval : '#FFF';
                                        if (this.colorpicker === null) {
                                            this.colorpicker = iro.ColorPicker('#picker', { width: 160, color: coul });
                                            this.colorpicker.on('color:change', (color: any) => {
                                                this.global.getFormComponent().form.get(l.toString())?.setValue(color.hexString);
                                            });
                                        }
                                    }
                                    else if (champ.typ === 'ref')
                                    {
                                        this.form.get(l.toString())?.setValue(defval);
                                        this.form.get(l.toString())?.addValidators([Validators.required]);
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                    }
                                    else if (champ.typ === 'codepostal')
                                    {
                                        this.form.get(l.toString())?.setValue(defval);
                                        this.form.get(l.toString())?.addValidators([Validators.required]);
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                    }
                                    else if (champ.typ === 'email')
                                    {
                                        this.form.get(l.toString())?.setValue(defval);
                                        this.form.get(l.toString())?.addValidators([Validators.required]);
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                    }
                                    else
                                    {
                                        this.form.get(l.toString())?.setValue(defval);
                                        this.form.get(l.toString())?.updateValueAndValidity();
                                    }
                                }
                            });
                        }
                        else {
                            if (this.input_action === 'input')
                            {
                                this.form.get(l.toString())?.setValue(0);
                            }
                            else if (this.input_action === 'update')
                            {
                                this.form.get(l.toString())?.setValue(this.input_id);
                            }
                            else if (this.input_action === '')
                            {
                                this.form.get(l.toString())?.setValue('');
                            }
                            this.form.get(l.toString())?.updateValueAndValidity();
                        }
                    }
                    this.loading = false;
                }, error: (err: any) => this.reconnect()
            });
        });
    }

    reconnect() {
        this.storage.set('status', 'error');
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    async appendImgtoBd() {
        if (this.model.getTable(this.numtable).nom === 'article') {
            for (let img of SubmitBase.listimg) {
                let numlstimg = this.model.getnumtable('artlistimg');
                let champslstimg = this.model.tables[numlstimg].champs;
                let row = [];

                for (let i = 0; i < champslstimg.length; i++) {
                    let val = '';
                    if (champslstimg[i].nom === 'artid') {
                        val = this.input_id.toString();
                    }
                    else if (champslstimg[i].nom === 'image') {
                        val = img.filename;
                    }
                    else if (champslstimg[i].nom === 'favori') {
                        val = img.favori ? '1' : '0';
                    }
                    else if (champslstimg[i].nom === 'visible') {
                        val = img.visible ? '1' : '0';
                    }
                    if (champslstimg[i].typ !== 'pk') {
                        let col = { nom: champslstimg[i].nom, valeur: val, type: champslstimg[i].typ, desc: champslstimg[i].desc };
                        row.push(col);
                    }
                }
                if (img.pkid === 0)
                {
                    await this.model.insertrow(this.bouticid, 'artlistimg', row, this);
                }
                else {
                    await this.model.updaterow(this.bouticid, 'artlistimg', row, 'artlistimgid', img.pkid, this);
                }
            }
        }
    }

    luminosite(couleur: any) {
        const r = parseInt(couleur.slice(1, 3), 16);
        const g = parseInt(couleur.slice(3, 5), 16);
        const b = parseInt(couleur.slice(5, 7), 16);
        return (r + g + b) / 3;
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Error,
            subHeader: strings.APITrouble,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    async onSubmit(event, act)
    {
        if (await this.onSubmitAction(event, act))
            this.goBack();
    }

    async onSubmitAction(event: Event, act: string):Promise<boolean>
    {
        this.isSubmitted = true;
        this.row = [];
        let pknom: any;
        let ok= true;
        let errmsg = '';
        let j = -1;
        for (let champ of this.champs)
        {
            j++;
            this.form.get(j.toString())?.setErrors(null);
            this.form.get(j.toString())?.updateValueAndValidity();
            if (this.form.get(j.toString())?.invalid)
            {
                return false;
            }
            else
            {
                let val: any;
                if (champ.typ === 'image')
                {
                    val = this.imgtruefilename;
                }
                else if (champ.typ === 'bool')
                {
                    val = this.form.get(j.toString())?.value ? '1' : '0';
                }
                else if (champ.typ === 'fk')
                {
                    val = (this.input_selcol === champ.nom) ? this.input_selid : this.form.get(j.toString()).value;
                    if (this.form.get(j.toString())?.value === "")
                    {
                        this.form.get(j.toString())?.setErrors({ required: true });
                    }
                    else
                    {
                        this.form.get(j.toString())?.setErrors(null);
                    }
                }
                else if (champ.typ !== 'pk')
                {
                    val = this.form.get(j.toString())?.value;
                    this.storage.remove('mem_fld_' + j);
                }
                else
                {
                    pknom = champ.nom;
                }
                if (champ.typ !== 'pk')
                {
                    let col = { nom: champ.nom, valeur: val, type: champ.typ, desc: champ.desc };
                    this.row.push(col);
                }
                this.form.get(j.toString())?.markAsTouched();
                this.form.get(j.toString())?.updateValueAndValidity();
            }
        }
        this.isSubmitted = true;
        let isError;
       if (act === 'update')
       {
           isError = await this.model.updaterow(this.bouticid, this.model.getTable(this.numtable).nom, this.row, pknom, this.input_id, this);
       }
       else if (act === 'insert')
       {
           isError = await this.model.insertrow(this.bouticid, this.model.getTable(this.numtable).nom, this.row, this);
       }
        if (!isError)
        {
            await this.appendImgtoBd();
            return true;
        }
        else
        {
            return false;
        }

    }

    gotoUpperPage(event: Event, act: string)
    {
        if (this.selid === 0) {
            this.selparam.setTable(this.input_table);
            this.selparam.setIdtoup(0);
            this.selparam.setSelid(0);
            this.selparam.setSelcol('');
            switch (this.input_table) {
                case 'categorie':
                case 'article':
                case 'groupeopt':
                    this.router.navigate(['admin/products/' + this.input_table ], { replaceUrl: true });
                    break;
                case 'barlivr':
                case 'cpzone':
                    this.router.navigate(['admin/deliveries/' + this.input_table], { replaceUrl: true });
                    break;
                case 'statutcmd':
                    this.router.navigate(['admin/customerarea/statutcmd'], { replaceUrl: true });
                    break;
                case 'promotion':
                    this.router.navigate(['admin/promotion'], { replaceUrl: true });
                    break;
                default:
                    this.router.navigate(['admin/' + this.input_table ], { replaceUrl: true });
                    break;

            }
        }
        else {
            this.selparam.setIdtoup(this.selid);
            switch (this.input_table)
            {
                case 'relgrpoptart':
                    this.selparam.setTable('article');
                    break;
                case 'option':
                    this.selparam.setTable('groupeopt');
                    break;
                default:
                    break;

            }
            this.router.navigate(['admin/update/soustable'], { replaceUrl: true });
        }
    }

    goBack()
    {
        this.getback.publishGetback({ table: this.input_table, action: this.input_action + 'record' });
        if (this.input_selid === 0)
        {
            this.input_selcol = '';
            switch (this.input_table)
            {
                case 'categorie':
                case 'article':
                case 'groupeopt':
                    this.router.navigate(['admin/products/' + this.input_table], {replaceUrl: true});
                    break;
                case 'barlivr':
                case 'cpzone':
                    this.router.navigate(['admin/deliveries/' + this.input_table], {replaceUrl: true});
                    break;
                case 'statutcmd':
                    this.router.navigate(['admin/customerarea/' + this.input_table], {replaceUrl: true});
                    break;
                case 'promotion':
                    this.router.navigate(['admin/promotion'], {replaceUrl: true});
                    break;
                default:
                    this.router.navigate(['admin/products/article'], {replaceUrl: true});
                    break;

            }
        }
        else {
            this.selparam.setSousTable(this.input_table);
            this.selparam.setIdtoup(this.input_selid);
            switch (this.input_table) {
                case 'relgrpoptart':
                    this.selparam.setTable('article');
                    break;
                case 'option':
                    this.selparam.setTable('groupeopt');
                    break;
                default:
                    break;
            }
            this.router.navigate(['admin/update/soustable'], { replaceUrl: true });
        }
    }

}
