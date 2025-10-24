import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationdetailsPage } from './registrationdetails.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],

})
export class RegistrationdetailsPageRoutingModule {}
