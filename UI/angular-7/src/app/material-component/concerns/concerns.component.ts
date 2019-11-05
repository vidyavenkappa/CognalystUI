import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-concerns',
  templateUrl: './concerns.component.html',
  styleUrls: ['./concerns.component.scss']
})
export class ConcernsComponent implements OnInit {

  urlGetAllNegativeKeywords="http://localhost:5001/getallnegative";
  b_name="Om Made Cafe";
  review={};
  allReview=[];
  
  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.getNegative();
  }
  getNegative()
  {
    this.dataService.postConfig(this.urlGetAllNegativeKeywords,{'b_name':this.b_name}).subscribe(data =>
      {
        this.review=data;
        
        for (let i of this.review['data'])
        {
            this.allReview.push(i['keyword']);
        }
        var unique = this.allReview.filter( this.onlyUnique );
        
        this.allReview=unique;
        console.log(this.allReview);
      },
      err => {
        console.log(err);
      });
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

}
