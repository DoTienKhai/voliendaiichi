import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
import {CountdownTimerComponent} from "../countdown-timer/countdown-timer.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'time',
    component: CountdownTimerComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
