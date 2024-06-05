import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllEmployeesComponent } from './components/all-employees/all-employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { AuthGuard } from './auth.guard';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: AllEmployeesComponent },
  { path: 'add', component: AddEmployeeComponent ,canActivate:[AuthGuard]},
  { path: 'edit/:id', component: EditEmployeeComponent ,canActivate:[AuthGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeeRoutes { }
