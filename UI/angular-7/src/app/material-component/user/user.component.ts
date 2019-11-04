import { Component } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import { FormControl ,FormGroup, Validators} from "@angular/forms";
import { StarRatingComponent } from 'ng-starrating';




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  
  
  value_rating=0;
  b_name="Om Made Cafe"
  sendData={};
  constructor(public dataService: DataService) {}
  
  ngOnInit(){
  }  

  
  
  urlReviews="http://localhost:5001/addreview"
  review_form = new FormGroup({
    username_control: new FormControl("", Validators.required),
    review_control: new FormControl("", Validators.required),
    rating_control: new FormControl("", Validators.required),
    date_control: new FormControl("", Validators.required)
  });

  //function to create Review
  writeReview()
  {
      console.log()
      this.sendData={
        "b_name":this.b_name,
        "review": this.review_form.get('review_control').value,
        "user": this.review_form.get('username_control').value,
        "user_rating":this.review_form.get('rating_control').value,
        "date": this.review_form.get('date_control').value
      };
      console.log(this.sendData);
      this.dataService.postConfig(this.urlReviews,this.sendData).subscribe(data =>
      {
        alert("Review Sucessfully created");
        this.review_form.reset();
        this.value_rating=0;
      },
      err => {
        console.log(err);
      });
  }
  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    this.value_rating=$event.newValue;
    this.review_form.patchValue({rating_control:$event.newValue});
  }
}
