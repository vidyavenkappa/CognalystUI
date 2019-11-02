import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../user/user.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

 

  review_form = new FormGroup({
    username_control: new FormControl(),
    review_control: new FormControl(),
    rating_control: new FormControl()
  });
  
  ngOnInit() {
  }
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    //data = data[alertmessage];
    this.dialogRef.close();
  }
}

