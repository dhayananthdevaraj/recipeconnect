import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { UsertaskComponent } from './usertask/usertask.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { DisplaytaskComponent } from './displaytask/displaytask.component';

const routes: Routes = [

  {path : '', redirectTo : '/login', pathMatch : 'full'},
  {path : 'register', component : RegisterComponent},
  {path : 'login', component : LoginComponent},
  {path : 'error', component : ErrorComponent},
  {path : 'usertask',component :  UsertaskComponent},
  {path : 'createtask', component: CreatetaskComponent},
  {path : 'displaytask', component: DisplaytaskComponent},
  {path : '**', redirectTo : '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
