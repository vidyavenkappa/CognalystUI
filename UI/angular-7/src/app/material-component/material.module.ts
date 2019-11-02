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
import { ListsComponent } from './lists/lists.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ReviewComponent } from './review/review.component';
import { BusinessComponent } from './business/business.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import {DialogComponent} from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { SelectModule } from 'ng2-select';
import {MatInputModule, MatFormFieldModule} from '@angular/material';
import {AgWordCloudModule} from 'angular4-word-cloud';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TagCloudModule } from 'angular-tag-cloud-module';
 
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
    TagCloudModule
 
  ],
  providers: [],
  entryComponents: [DialogComponent],
  declarations: [
    UserComponent,
    BusinessComponent,
    GridComponent,
    ListsComponent,
    MenuComponent,
    TabsComponent,
    StepperComponent,
    ReviewComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    ProgressComponent,
    DialogComponent,
    TooltipComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent
  ]
})
export class MaterialComponentsModule {}
