import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing/listing.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: '', component: ListingComponent }
]

@NgModule({
  declarations: [ListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule
  ]
})
export class TrackerModule { }
