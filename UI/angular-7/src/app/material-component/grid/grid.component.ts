import { Component } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  urlGetAllReviews="http://localhost:5001/allsortednouns";
  //b_name='Metro Points Hotel-Washington North';
  b_name='Om Made Cafe';
  reviewData=[];
  allreview={};
  topPos=[];
  topNeg=[];
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.getallReviews();
  }
  getallReviews()
  {
    this.dataService.postConfig(this.urlGetAllReviews,{'b_name':this.b_name}).subscribe(data =>
    {
      this.allreview=data;
      
      console.log(this.allreview['data']['pos'])
      for (let i of this.allreview['data']['pos'])
      {
        this.topPos.push(i[0]);
      }
      for (let i of this.allreview['data']['neg'])
      {
        this.topNeg.push(i[0]);
      }
    },
    err => {
      console.log(err);
    });
    
  }
}
