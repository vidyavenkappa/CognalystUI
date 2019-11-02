import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReviewData} from '../business/business.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

 

  review_form = new FormGroup({
    username_control: new FormControl(),
    review_control: new FormControl(),
    rating_control: new FormControl()
  });
  
  ngOnInit() {
  }
  constructor(
    public dialogRef: MatDialogRef<ReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewData) {}

  onNoClick(): void {
    //data = data[alertmessage];
    this.dialogRef.close();
  }
}

