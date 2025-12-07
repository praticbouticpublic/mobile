import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SessionbackService} from "./sessionback.service";

export const identifiedGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const sessionback = inject(SessionbackService);

        if (!await sessionback.getLogged())
        {
            await router.navigate(['admin/logout']);
            return false;
        }

    return true;
};
