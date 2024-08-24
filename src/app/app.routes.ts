import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
  {path: '', redirectTo: 'volien-daiichi', pathMatch: 'full'},
  {path: 'volien-daiichi', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)}
];
