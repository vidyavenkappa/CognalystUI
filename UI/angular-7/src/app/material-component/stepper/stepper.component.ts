import { Component, OnInit } from '@angular/core';
//import { allReviews } from '../business/business.component';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  
  urlGetAllReviews="http://localhost:5001/getallreviews";
  //b_name='Metro Points Hotel-Washington North';
  b_name='Om Made Cafe';
  reviewData=[];
  allreview={};
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.getallReviews();
  }
  getallReviews()
  {
    this.dataService.postConfig(this.urlGetAllReviews,{'b_name':this.b_name}).subscribe(data =>
    {
      this.allreview=data;
      var j=1;
      //console.log(this.allreview['data'])
      for (let i of this.allreview['data'])
      {
        this.reviewData.push({"username":i['user'],"rating":i['predicted_rating'],"review":i['review']})
      }
    },
    err => {
      console.log(err);
    });
    
  }
}
