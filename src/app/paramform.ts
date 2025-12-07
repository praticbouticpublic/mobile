import { FormBuilder, FormControl, FormGroup, Validator, ValidatorFn } from "@angular/forms";
import { AlertController } from "@ionic/angular/standalone";
import { Observable } from "rxjs";
import { strings } from "./strings";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";

export interface field {
    type: string;
    nom: string;
    param: string;
    value: any | null;
    validators: ValidatorFn[] | null;
}


export abstract class paramForm {
    formGroup!: FormGroup;
    fields: field[] = new Array();
    number = 0;
    loadingState = true;
    isSubmitted = false;
    logoloaded = true;
    bouticalreadytaken = false;
    bouticid = '';
    nameform = '';
    modified = false;
    apiroot = environment.apiroot;
    frontroot = environment.frontroot;

    constructor(public alertController: AlertController, public httpClient: HttpClient, public storage: StorageService,
        public router: Router, public formbuilder: FormBuilder) {
        this.formGroup = this.formbuilder.group({});
    }

    init() {

       this.unflagAsModified();
       this.storage.set('lasturl', this.router.url);
          this.storage.get('bouticid').then(bouticid => {
              this.bouticid = bouticid;
              this.getStoredData();
          });
    }

    flagAsModified() {
        this.modified = true;
    }

    unflagAsModified() {
        this.modified = false;
    }

    get errorControl() {
        return this.formGroup.controls;
    }

    errorControlfield(index: any) {
        return this.formGroup.get(index);
    }

    protected abstract getStoredForm(prop: string): Promise<Observable<string>>;

    protected abstract setStoredForm(prop: string, valeur: string): Promise<Observable<string>>;

    setValField(fi: field, dat: string) {
        switch (fi.type) {
            case 'prix':
                fi.value = parseFloat(parseFloat(dat).toFixed(2));
                break;
            case 'bool':
                fi.value = dat === '1';
                break;
            case 'pass':
                fi.value = '';
                break;
            case 'image':
            case 'url':
            case 'radio':
            case 'text':
            default:
                fi.value = dat;
        }
    }

    getValField(type: string, fldval: any): string | null {
        let ret = '';
        switch (type) {
            case 'prix':
                ret = parseFloat(fldval).toFixed(2);
                break;
            case 'bool':
                ret = fldval ? '1' : '0';
                break;
            case 'pass':
            case 'image':
            case 'url':
            case 'radio':
            case 'text':
            default:
                ret = String(fldval);
        }
        return ret;
    }

    async getStoredData() {
        if (this.fields[this.number].type !== "passconf") {
            (await this.getStoredForm(this.fields[this.number].param)).subscribe({
                next: (data: any) => {
                    this.setValField(this.fields[this.number], data.value);
                    this.number++;
                    if (this.number < this.fields.length)
                        this.getStoredData();
                    else {
                        this.buildForm();
                        this.loadingState = false;
                    }
                },
                error: (err: any) => {
                    this.presentAlert(err.error.error);
                    this.reconnect();
                }
            });
        }
        else {
            this.number++;
            if (this.number < this.fields.length)
                this.getStoredData();
            else {
                this.buildForm();
                this.loadingState = false;
            }

        }
    }

    buildForm() {
        this.fields.forEach((field, idxparam) => {
            this.formGroup.addControl(this.fields[idxparam].nom, new FormControl());
            this.formGroup.get(this.fields[idxparam].nom)?.setValue(this.fields[idxparam].value);
            this.formGroup.get(this.fields[idxparam].nom)?.addValidators(field.validators);
        });
    }

    async setStoredData() {
        let cantcontinue = false;
        if (this.fields[this.number].type === "pass") {
            if (this.formGroup.get('clpass')?.value === '') {
                this.number++;
            }
            if (this.formGroup.get('clpass')?.value !== this.formGroup.get('clpassconf')?.value) {
                this.presentAlert(strings.PasswordMissmatch);
                cantcontinue = true;
            }
        }
        if (!cantcontinue) {
            if (this.fields[this.number].type !== "passconf") {
                (await this.setStoredForm(this.fields[this.number].param, this.getValField(this.fields[this.number].type, this.formGroup.get(this.fields[this.number].nom)?.value))).subscribe({
                    next: (data: string) => {
                        if (data === 'OK') {
                            if (this.fields[this.number].nom === 'alias') {
                                this.bouticalreadytaken = false;
                            }
                        }
                        else if (data === 'KO') {
                            if (this.fields[this.number].nom === 'alias') {
                                this.bouticalreadytaken = true;
                            }
                        }
                        this.number++;
                        if (this.number < this.fields.length)
                            this.setStoredData();
                    },
                    error: (err: any) => {
                        this.reconnect();
                        this.presentAlert(err.error.error);
                    }
                });
            }
            else {
                this.number++;
                if (this.number < this.fields.length)
                    this.setStoredData();
            }
        }
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème API',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    onSubmit() {
        this.isSubmitted = false;
        // If there are any async validators
        //
        this.formGroup.clearAsyncValidators();
        // If there are any normal validators
        //
        this.formGroup.clearValidators();
        // Doing the validation on all the controls to put them back to valid
        //
        this.formGroup.updateValueAndValidity();
        if (!this.formGroup.valid) {
            //this.flagAsModified();
        }
        else {
            this.unflagAsModified();
            this.number = 0;
            this.setStoredData();
            this.fields.forEach((fld: field) => {
                this.storage.remove('pbca_' + this.nameform + '_' + fld.nom);
            });
            this.unflagAsModified();
        }
    }

    onUndo() {
        this.isSubmitted = false;
        this.fields.forEach((fld: field) => {
            this.storage.remove('pbca_' + this.nameform + '_' + fld.nom);
        });
        this.cancelUpdates();
        this.unflagAsModified();
    }

    cancelUpdates() {
        this.fields.forEach((field, idxparam) => {
            this.formGroup.get(this.fields[idxparam].nom)?.setValue(this.fields[idxparam].value);
        });
    }

    uploadlogo(files: any) {
        // Fonction pour convertir base64 en Blob
        function base64ToBlob(base64Data: string, mimeType: string) {
            const byteString = atob(base64Data.split(',')[1] || base64Data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const intArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            return new Blob([intArray], { type: mimeType });
        }

        const formData = new FormData();

        for (let file of files) {
            let blob: Blob;

            if (file.data && file.mimeType) {
                blob = base64ToBlob(file.data, file.mimeType);
            } else if (file.blob) {
                blob = file.blob;
            } else {
                blob = file;
            }

            formData.append('file[]', blob, file.name);
        }

        this.logoloaded = false;

        this.httpClient.post<string[]>(environment.apiroot + 'boupload', formData, { withCredentials: true }).subscribe({
            next: (data) => {
                if (data.length > 0) {
                    this.formGroup.get('logo')?.setValue(data[0]);
                }
                this.logoloaded = true;
                this.flagAsModified();
            },
            error: (err) => {
                this.logoloaded = true;
                this.reconnect();
                this.presentAlert(err.error?.error || 'Erreur lors de l\'upload');
            }
        });
    }


    closeimg() {
        this.formGroup.get('logo')?.setValue(null);
        this.bak('pbca_shop_logo', '');
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

    gotoUpperPage() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    reconnect() {
        this.storage.set('status', 'error');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    onFileChoose(elem: any) {
        this.uploadlogo(elem.target);
    }

}
