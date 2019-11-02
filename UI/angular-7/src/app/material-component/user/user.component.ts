import { Component } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
//import { takeWhile } from 'rxjs/operators';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export interface DialogData {
  username: string;
  review:string;
  item:string;
  rating:number;
}


export interface Data {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  
  tiles: Tile[] = [
    {text: 'RESTAURANTS', cols: 1, rows: 1, color: '#ffc107'},
    {text: 'NETWORKING COMPANIES', cols: 1, rows: 1, color: '#007bff'}
  ];
  dataItem: Data[]=[];
  result={};
  review:string;
  item:string;
  username: string;
  rating:number;
  sendData={};
  constructor(public dataService: DataService,public dialog: MatDialog) {}
  
  ngOnInit(){
    
    //this.getData();
  }  
  //dataItem=[];
  
  domain:String;
  animal: string;
  name: string
  urlReviews="http://localhost:5001/addreview"
  
  //function to obtain the selected option
  public selected(value) {
    //console.log('Selected value is: ', value.text);
    

    if(value == "RESTAURANTS")
    {
      this.dataItem[0]={text: 'Om Made Cafe', cols: 1, rows: 1, color: '#dc3545'};
      this.dataItem[1]={text: 'hall in the wall', cols: 1, rows: 1, color: '#28a745'};
    }
    else if(value == "NETWORKING COMPANIES")
    {
      this.dataItem[0]={text: 'cisco', cols: 1, rows: 1, color: '#dc3545'};
      this.dataItem[1]={text: 'aruba', cols: 1, rows: 1, color: '#28a745'};
      
    }
    
  }
 
  writeReview(item)
  {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      height:'auto',
      panelClass: 'alert-message-style',
      data:{review:this.review,item:item,username:this.username,rating:this.rating}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.result=result;
      this.sendData={
        "b_name":item,
        "review": this.result['review'],
        "user": this.result['username'],
        "user_rating":this.result['rating']
      };
      console.log(this.sendData);
      this.dataService.postConfig(this.urlReviews,this.sendData).subscribe(data =>
        {
          
          
        },
        err => {
          console.log(err);
        });
        
    });
  }


}
