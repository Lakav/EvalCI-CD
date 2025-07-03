import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { UserComponent } from '../app/user/user.component';
import { UserRegisterComponent } from '../user-register/user-register.component';

export const routes: Routes = [{
  path:'',component:TodoComponent,pathMatch:'full'
},
{ path: 'user', component:UserComponent, pathMatch: 'full' },
{ path: 'register', component: UserRegisterComponent, pathMatch: 'full' }
];
