import { Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { GridComponent } from './grid/grid.component';
import { StepperComponent } from './stepper/stepper.component';
import { ReviewComponent } from './review/review.component';
import { BusinessComponent } from './business/business.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import { DialogComponent } from './dialog/dialog.component';

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
    path: 'progress-snipper',
    component: ProgressSnipperComponent
  },
  {
    path: 'progress',
    component: ProgressComponent
  },
  {
    path: 'dialog',
    component: DialogComponent
  }
];
