import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import {DataService} from './services/data.service';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
   ],
  providers: [ MenuItems,
    DataService ]
})
export class SharedModule { }
