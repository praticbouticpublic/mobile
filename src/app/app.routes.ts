// app.routes.ts
import { Routes } from '@angular/router';
import { RedirectComponent } from './redirect/redirect.component';
import {PromotionComponent} from "./promotion/promotion.component";
import {identifiedGuard} from "./identified-guard";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin/welcome',
        pathMatch: 'full'
    },
    {
        path: 'admin/orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule)
    },
    {
        path: 'admin/detailsorder',
        loadChildren: () => import('./orders/detailsorder/detailsorder.module').then(m => m.DetailsorderPageModule)
    },
    {
        path: 'admin/orderlines',
        loadChildren: () => import('./orders/detailsorder/orderlines/orderlines.module').then(m => m.OrderlinesPageModule)
    },
    {
        path: 'admin/products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/deliveries',
        loadChildren: () => import('./deliveries/deliveries.module').then(m => m.DeliveriesPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/customerarea',
        loadChildren: () => import('./customerarea/customerarea.module').then(m => m.CustomerareaPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/subscription',
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionPageModule)
    },
    {
        path: 'admin/mymoney',
        loadChildren: () => import('./mymoney/mymoney.module').then(m => m.MymoneyPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'admin/displaytable',
        loadChildren: () => import('./displaytable/displaytable.module').then(m => m.DisplaytablePageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/displayrecord',
        loadChildren: () => import('./displayrecord/displayrecord.module').then(m => m.DisplayrecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/insertrecord',
        loadChildren: () => import('./displaytable/insertrecord/insertrecord.module').then(m => m.InsertrecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/updaterecord',
        loadChildren: () => import('./displaytable/updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/viewrecord',
        loadChildren: () => import('./displaytable/viewrecord/viewrecord.module').then(m => m.ViewrecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/shop',
        loadChildren: () => import('./customerarea/shop/shop.module').then(m => m.ShopPageModule)
    },
    {
        path: 'admin/settings',
        loadChildren: () => import('./customerarea/settings/settings.module').then(m => m.SettingsPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/orderstatus',
        loadChildren: () => import('./customerarea/orderstatus/orderstatus.module').then(m => m.OrderstatusPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/backoffice',
        loadChildren: () => import('./customerarea/backoffice/backoffice.module').then(m => m.BackofficePageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/qrcodegen',
        loadChildren: () => import('./customerarea/qrcodegen/qrcodegen.module').then(m => m.QrcodegenPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/client',
        loadChildren: () => import('./customerarea/client/client.module').then(m => m.ClientPageModule)
    },
    {
        path: 'admin/registration',
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule)
    },
    {
        path: 'admin/identification/:email',
        loadChildren: () => import('./identification/identification.module').then(m => m.IdentificationPageModule)
    },
    {
        path: 'admin/registrationdetails',
        loadChildren: () => import('./registrationdetails/registrationdetails.module').then(m => m.RegistrationdetailsPageModule)
    },
    {
        path: 'admin/shopdetails',
        loadChildren: () => import('./shopdetails/shopdetails.module').then(m => m.ShopdetailsPageModule)
    },
    {
        path: 'admin/shopsettings',
        loadChildren: () => import('./shopsettings/shopsettings.module').then(m => m.ShopsettingsPageModule)
    },
    {
        path: 'admin/subscriptionchoice/:type',
        loadChildren: () => import('./subscriptionchoice/subscriptionchoice.module').then(m => m.SubscriptionchoicePageModule)
    },
    {
        path: 'admin/paymentdetails/:type',
        loadChildren: () => import('./paymentdetails/paymentdetails.module').then(m => m.PaymentdetailsPageModule)
    },
    {
        path: 'admin/termsandconditions/:type',
        loadChildren: () => import('./termsandconditions/termsandconditions.module').then(m => m.TermsandconditionsPageModule)
    },
    {
        path: 'admin/forgotpassword',
        loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule)
    },
    {
        path: 'admin/update',
        loadChildren: () => import('./update/update.module').then(m => m.UpdatePageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/raddressing',
        loadChildren: () => import('./raddressing/raddressing.module').then(m => m.RaddressingPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/changification/:email',
        loadChildren: () => import('./changification/changification.module').then(m => m.ChangificationPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'admin/welcome',
        loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
    },
    {
        path: 'admin/carte',
        loadChildren: () => import('./carte/carte.module').then(m => m.CartePageModule)
    },
    {
        path: 'admin/getinfo',
        loadChildren: () => import('./getinfo/getinfo.module').then(m => m.GetinfoPageModule)
    },
    {
        path: 'admin/paiement',
        loadChildren: () => import('./paiement/paiement.module').then(m => m.PaiementPageModule)
    },
    {
        path: 'admin/fin',
        loadChildren: () => import('./fin/fin.module').then(m => m.FinPageModule)
    },
    {
        path: 'admin/debut/:customer/:method/:table',
        loadChildren: () => import('./debut/debut.module').then(m => m.DebutPageModule)
    },
    {
        path: 'admin/error',
        loadChildren: () => import('./error/error.module').then(m => m.ErrorPageModule)
    },
    {
        path: 'admin/logout',
        loadChildren: () => import('./logout/logout.module').then(m => m.LogoutPageModule)
    },
    {
        path: 'admin/promotion',
        component: PromotionComponent,
        canActivate: [identifiedGuard]
    },
    {
        path: 'onboarding-complete',
        redirectTo: 'admin/products',
        pathMatch: 'full'
    },
    {
        path: 'onboarding-cancelled',
        redirectTo: 'admin/products',
        pathMatch: 'full'
    },
    {
        path: 'admin/displaysousrecord',
        loadComponent: () => import('./displaysousrecord/displaysousrecord.page').then( m => m.DisplaysousrecordPage),
        canActivate: [identifiedGuard]
    },
    { path: ':customer/:method/:table', redirectTo: 'admin/debut/:customer/:method/:table', pathMatch: 'full' },
    { path: ':customer', redirectTo: 'admin/debut/:customer/3/0', pathMatch: 'full' }
];
