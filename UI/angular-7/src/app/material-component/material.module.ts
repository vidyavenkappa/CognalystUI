import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatDialogModule} from '@angular/material/dialog';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { UserComponent } from './user/user.component';

import { GridComponent } from './grid/grid.component';

import { StepperComponent } from './stepper/stepper.component';
import { ReviewComponent } from './review/review.component';
import { BusinessComponent } from './business/business.component';
import {DialogComponent} from './dialog/dialog.component';

import { GoogleChartsModule } from 'angular-google-charts';
import { SelectModule } from 'ng2-select';
import {MatInputModule, MatFormFieldModule} from '@angular/material';
import {AgWordCloudModule} from 'angular4-word-cloud';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TagCloudModule } from 'angular-tag-cloud-module';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { RatingModule } from 'ng-starrating';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
 
@NgModule({
  imports: [
    CommonModule,
    SelectModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    GoogleChartsModule,
    AgWordCloudModule.forRoot(),
    MatDatepickerModule,
    TagCloudModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "outerStrokeWidth": 40,
      "innerStrokeWidth": 5,
      "showBackground": false,
      "startFromZero": false,
      "subtitleFontSize":"14",
      "titleFontSize":"25",
      "subtitle":["Satisfied"]
    }),
    RatingModule
 
  ],
  providers: [],
  entryComponents: [DialogComponent],
  declarations: [
    UserComponent,
    BusinessComponent,
    GridComponent,
    StepperComponent,
    ReviewComponent,
    DialogComponent,
    ThankYouPageComponent
  ]
})
export class MaterialComponentsModule {}
