import { Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TodoComponent } from './todo/todo.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HangingGameComponent } from './hanging-game/hanging-game.component';
import { UserComponent } from '../app/user/user.component';
import { UserRegisterComponent } from '../user-register/user-register.component';

export const routes: Routes = [{
 path:'tasks', component:DragDropComponent,pathMatch:'full'

},{
  path:'todos',component:TodoComponent,pathMatch:'full'
}, { path: '', redirectTo: 'todos', pathMatch: 'full' },{
  path:'weather',component:WeatherComponent,pathMatch:'full'
},{ path: 'guess-word', component:HangingGameComponent,pathMatch: 'full' },{
  path:'weather',component:WeatherComponent,pathMatch:'full'
},
{ path: 'user', component:UserComponent, pathMatch: 'full' },
{ path: 'register', component: UserRegisterComponent, pathMatch: 'full' }
];
