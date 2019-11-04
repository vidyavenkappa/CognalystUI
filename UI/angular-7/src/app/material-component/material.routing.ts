import { Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { GridComponent } from './grid/grid.component';
import { StepperComponent } from './stepper/stepper.component';
import { ReviewComponent } from './review/review.component';
import { BusinessComponent } from './business/business.component';

import { DialogComponent } from './dialog/dialog.component';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';

export const MaterialRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'business',
    component: BusinessComponent
  },
  {
    path: 'grid',
    component: GridComponent
  },
  {
    path: 'stepper',
    component: StepperComponent
  },
  {
    path: 'review',
    component: ReviewComponent
  },
  {
    path: 'dialog',
    component: DialogComponent
  },
  {
    path: 'thank-you-page',
    component: ThankYouPageComponent
  }
];
