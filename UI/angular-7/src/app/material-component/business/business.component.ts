import {DataService} from '../../shared/services/data.service';
import { Component, ViewChild, ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReviewComponent } from '../review/review.component';
import { AgWordCloudData } from 'angular4-word-cloud';
import { FormControl,FormGroup } from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';


export interface ReviewData {
  review:String;
}
export interface allReviews{
  username:String;
  rating:Number;
  review:String;
}
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})


export class BusinessComponent {

  
  panelOpenState = false;

  urlGetAllReviews="http://localhost:5001/getallreviews";
  urlGetAllPositiveKeywords="http://localhost:5001/getallpositive";
  urlGetAllNegativeKeywords="http://localhost:5001/getallnegative";
  urlGetPositiveKeywords="http://localhost:5001/getrecentposkeywords";
  urlGetNegativeKeywords="http://localhost:5001/getrecentnegkeywords";
  urlGetTopTenPositiveReviews="http://localhost:5001/gettopfivereviews";
  urlGetTopTenNegativeReviews="http://localhost:5001/getbottomfivereviews";
  urlGetSummary="http://localhost:5001/getsummary";
  urlGetPosWordCloud = "http://localhost:5001/getallpositivewordcloud";
  urlGetIntervalReviews = "http://localhost:5001/getnegativeintimeperiod";
  urlGetSatisfactionData = "http://localhost:5001/allratios";
  urlGetWordCloudPos="http://localhost:5001/getallpositivewithscores";
  urlGetWordCloudNeg="http://localhost:5001/getallnegativewithscores";
  urlGetReviewsOverTime ="http://localhost:5001/getallreviewssortedovertime";
  urlGetOverallSatisfaction="http://localhost:5001/getoverallsatisfaction";
  urlGetAllKeywords="http://localhost:5001/getrecentkeywords";

  satisfactionAvg:number;
  satisfaction:number;
  graphData={};
  subtitle="liked this Attribute"
  //b_name='Metro Points Hotel-Washington North';
  b_name='Om Made Cafe';
  businesses= [
    {value: 'cafe noir'},
    {value: 'Om Made Cafe'},
    {value: 'hall in the wall'},
    {value: 'cisco'},
    {value: 'aruba'}
  ];
  timepos='fortnight';
  timeneg='fortnight';
  time_frame=[
    {value: 'week'},
    {value: 'fortnight'},
    {value: 'month'},
  ];
  

  //assign color
  outColor=""
  inColor=""
  outColorAvg=""
  inColorAvg=""
  outColorCust=""
  inColorCust=""


  selected = 'positive_cloud';

  allreviews:allReviews[]=[];
  review={};
  keywords={};
  allReview='';
  allKeywordsPos='';
  allKeywordsNeg='';
  allKeywordsPosArr=[];
  allKeywordsNegArr=[];
  topTenPositiveReviews='';
  topTenNegativeReviews='';
  negativeReviews=[];
  positiveReviews=[];
  summary:String;
  summaryObj={};
  wordDataPosObj={};
  wordData={};
  satisfactionKeyword:Number;
  reviewInterval=[];

  cloud_control = new FormControl("positive_cloud")

  title:String;
  type="LineChart";
  data = [];
  dataObj=[];
  columnNames = [];
  optionsCloud: CloudOptions  = {};
  options={};
  width :Number;
  height :Number;
  logo=['assets/images/male_logo.jpeg','assets/images/female_logo.jpeg']
  photos = ['assets/images/1.jpg','assets/images/2.jpg','assets/images/3.jpg','assets/images/4.jpg','assets/images/5.jpg']
  colors=['#f0134d','#40bfc1','#3c4245','#3e64ff','#f1bc31','#2a1a5e']
  titleHist:String;
  typeHist="LineChart";
  dataHist = [];
  dataObjHist=[];
  columnNamesHist = [];
  optionsHist = {};
  widthHist :Number;
  heightHist :Number;

  titleSat:String;
  typeSat="LineChart";
  dataSat = [];
  dataObjSat=[];
  columnNamesSat = [];
  optionsSat = {};
  widthSat :Number;
  heightSat :Number;

  keywordsData=[];
  dataItems=[];

  wordDataPos: CloudData[] =[];
  //optionsCloud={};
  optionsCloudPos={};
  //wordDataPos: Array<AgWordCloudData>=[];
  business_data = new FormGroup({
    b_name: new FormControl()
  });

  keyword_pos_data = new FormGroup({
    tframe_pos: new FormControl()
  });

  keyword_neg_data = new FormGroup({
    tframe_neg: new FormControl()
  });

  date_data = new FormGroup({
    date1 : new FormControl(),
    date2 : new FormControl()
  })
  
  minDate1 = new Date(2000, 0, 1);
  maxDate1 = new Date(2020, 0, 1);
  minDate2 = new Date(2000, 0, 1);
  maxDate2 = new Date(2020, 0, 1);

  constructor(public dataService: DataService,public dialog: MatDialog,private router: Router) {}
  

  ngOnInit(){
    this.graphPredictedVSUserRating();
    this.getCustomerSatisfaction();
    this.getTopTenNegativeReviews();
    this.getTopTenPositiveReviews();
    this.wordCloudPos();
    this.getPositiveKeywords();
    this.getNegativeKeywords();
    this.Summary();
    this.getSatisfactionGraph();
    this.graphAllReviewsOverTime();
  }
  getAllReviews()
  {
    this.allReview='';
    if(this.b_name!= undefined)
    {
      
        
        this.router.navigate(['/stepper'])
      
    }
    else{
      alert('Select the business Name');
    }
  }
  getAllPositive()
  {
    this.allReview='';
    if(this.b_name!= undefined)
    {
      
      this.dataService.postConfig(this.urlGetAllPositiveKeywords,{'b_name':this.b_name}).subscribe(data =>
        {
          this.review=data;
          var j=1;
          for (let i of this.review['data'])
          {
              this.allReview = this.allReview+j+". "+ i['keyword']+"\n\n";
              j++;
          }
          
          const dialogRef = this.dialog.open(ReviewComponent, {
            width: '500px',
            height:'auto',
           
            panelClass: 'alert-message-style',
            data:{review:this.allReview,title:"All Positive Keywords"}
          });
          
          dialogRef.afterClosed().subscribe(result => {
            
          });
        
        },
        err => {
          console.log(err);
        });
      }
      else{
        alert('Select the business Name');
      }
  }
  getAllNegative()
  {
    this.allReview='';

    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetAllNegativeKeywords,{'b_name':this.b_name}).subscribe(data =>
      {
        this.review=data;
        var j=1;
        for (let i of this.review['data'])
        {
            this.allReview = this.allReview+j+". "+ i['keyword']+"\n\n";
            j++;
        }
       
        const dialogRef = this.dialog.open(ReviewComponent, {
          width: '500px',
          height:'auto',
          panelClass: 'alert-message-style',
          data:{review:this.allReview,title:"All Negative Keywords"}
        });
        
        dialogRef.afterClosed().subscribe(result => {
          
        });
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  
  } 
  getPositiveKeywords()
  {
    this.allKeywordsPos='';
    
    if(this.b_name!= undefined)
    {
      //console.log(this.timepos);
      this.dataService.postConfig(this.urlGetPositiveKeywords,{'b_name':this.b_name,'since':this.timepos}).subscribe(data =>
      {
        this.keywords=data;
        var j=1;
        for (let i of this.keywords['data'])
        {
            this.allKeywordsPosArr.push(i['keyword']);
            
        }
        
        var unique = this.allKeywordsPosArr.filter( this.onlyUnique );
        for(let i in unique)
        {
          this.allKeywordsPos = this.allKeywordsPos+j+". "+ unique[i]+"\n";
          j++;
        }
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }
  getNegativeKeywords()
  {
    this.allKeywordsNeg='';
    
    if(this.b_name!= undefined)
    {
     
      this.dataService.postConfig(this.urlGetNegativeKeywords,{'b_name':this.b_name,'since':this.timeneg}).subscribe(data =>
      {
        this.keywords=data;
        var j=1;
        for (let i of this.keywords['data'])
        {
          this.allKeywordsNegArr.push( i['keyword']);
          
        }
        this.allKeywordsNegArr = this.allKeywordsNegArr.filter(item => this.allKeywordsPos.indexOf(item) < 0);
        
        var unique = this.allKeywordsNegArr.filter( this.onlyUnique );
        for(let i in unique)
        {
          this.allKeywordsNeg = this.allKeywordsNeg+j+". "+ unique[i]+"\n";
          j++;
        }
       
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }

  getTopTenPositiveReviews()
  {
    this.allKeywordsPos='';
    
    if(this.b_name!= undefined)
    {
     
      this.dataService.postConfig(this.urlGetTopTenPositiveReviews,{'b_name':this.b_name}).subscribe(data =>
      {
        this.keywords=data;
        var j=1;
        for (let i of this.keywords['data'])
        {
            this.positiveReviews.push({'username':i['user'],'rating':i['predicted_rating'],'review':i['review'],'logo':this.logo[j%2],'photos':this.photos[j%5]})
            
            j++;
        }
        
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  getTopTenNegativeReviews()
  {
    this.allKeywordsNeg='';
    
    if(this.b_name!= undefined)
    {
     
      this.dataService.postConfig(this.urlGetTopTenNegativeReviews,{'b_name':this.b_name}).subscribe(data =>
      {
        this.keywords=data;
        var j=1;
        
        for (let i of this.keywords['data'])
        {
            this.negativeReviews.push({'username':i['user'],'rating':i['predicted_rating'],'review':i['review'],'logo':this.logo[j%2],'photos':this.photos[j%5] })
            
            j++;
        }
      
        
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  getCustomerSatisfaction()
  {
    
    //this.satisfaction=50;
    this.allReview='';
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetAllReviews,{'b_name':this.b_name}).subscribe(data =>
      {
        var obj = data;
        var data = obj['data']
        var total_score=0;
        var j=0;
        for(let i in data)
        {
           total_score += data[i]['predicted_rating']
           j++;
        }
        this.satisfactionAvg = total_score/(5*j)*100;
        if(this.satisfactionAvg>=0 && this.satisfactionAvg<20)
        {
          this.outColorAvg='#ff0015'
          this.inColorAvg='#ff606d'
          
        }
        else if(this.satisfactionAvg>=20 && this.satisfactionAvg<50)
        {
          this.outColorAvg='#fd7800'
          this.inColorAvg='#f8aa7e'
          
        }
        else if(this.satisfactionAvg>=50 && this.satisfactionAvg<75)
        {
          this.outColorAvg='#FDB900'
          this.inColorAvg='#f8d797'
        }
        else if(this.satisfactionAvg>=75 && this.satisfactionAvg<=100)
        {
          this.outColorAvg='#78C000'
          this.inColorAvg='#C7E596'
        }
    

        
       
      },
      err => {
        console.log(err);
      });

      this.dataService.postConfig(this.urlGetOverallSatisfaction,{'b_name':this.b_name}).subscribe(data =>
        {
         
          
          
          this.satisfaction = data['satisfaction'];
          if(this.satisfaction>=0 && this.satisfaction<20)
          {
            this.outColorCust='#ff0015'
            this.inColorCust='#ff606d'
            
          }
          else if(this.satisfaction>=20 && this.satisfaction<50)
          {
            this.outColorCust='#fd7800'
            this.inColorCust='#f8aa7e'
          }
          else if(this.satisfaction>=50 && this.satisfaction<75)
          {
            this.outColorCust='#FDB900'
            this.inColorCust='#f8d797'
          }
          else if(this.satisfaction>=75 && this.satisfaction<=100)
          {
            this.outColorCust='#78C000'
            this.inColorCust='#C7E596'
          }
          
         
        },
        err => {
          console.log(err);
        });
    }
    else{
      alert('Select the business Name');
    }
  }
  graphPredictedVSUserRating()
  {
    this.allReview='';
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetAllReviews,{'b_name':this.b_name}).subscribe(data =>
      {
       
        var j=1;
        this.graphData=data;
        
        this.title="Predicted Rating VS User Rating";
        this.type="LineChart";
        this.options = {   
          hAxis: {
            title: 'Users'
          },
          vAxis:{
            title: 'Ratings'
          },
          curveType: 'function',
          legend: { position: 'bottom' },
          
        };
        this.width = 720;
        this.height = 400;
        
        //console.log(this.graphData);
        for(let i=0;i<this.graphData['data'].length;i++)
        {
          let row=[];
          row[0] = String(j);
          row[1] = Number(this.graphData['data'][i]['predicted_rating']);
          row[2] = Number(this.graphData['data'][i]['manual_rating']);
          
          this.data[j-1]=row;
          
          j++; 
        }
        
        //console.log(this.data);
        this.columnNames[0]= "Reviews";
        this.columnNames[1]= "predicted_rating";
        this.columnNames[2]= "user_rating";
       
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  
  selectBusiness()
  {
    this.b_name=this.business_data.get('b_name').value;
    this.getCustomerSatisfaction();
    this.graphPredictedVSUserRating();
    this.getTopTenNegativeReviews();
    this.getTopTenPositiveReviews();
    this.wordCloudPos();
    this.getPositiveKeywords();
    this.getNegativeKeywords();
  }
  selectPosTimeFrame(time)
  {
    this.timepos=time;
    //console.log(this.timepos);
    this.getPositiveKeywords();
  }
  selectNegTimeFrame(time)
  {
    this.timeneg=time;
    this.getNegativeKeywords();
  }
  Summary()
  {
    this.summary='';
    
    if(this.b_name!= undefined)
    {
     
      this.dataService.postConfig(this.urlGetSummary,{"b_name":this.b_name}).subscribe(data =>
      {
        this.summaryObj=data;
        this.summary=this.summaryObj['data'];
        
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  wordCloudPos()
  {
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetWordCloudPos,{'b_name':this.b_name}).subscribe(data =>
        {
          this.wordDataPosObj=data;
          
          this.wordData=this.wordDataPosObj['data'];
          let j=0;
          this.wordDataPos=[];
          for(let i in this.wordData)
          {
              this.wordDataPos[j]={weight:this.wordData[i][1],text:this.wordData[i][0],color:this.colors[j%6]};
              j++;
          }
          
          this.optionsCloud= {
            // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
            width: 1000,
            height: 400,
            overflow: false,
          };
        },
        err => {
          console.log(err);
        });
      
      
    }
    else{
      alert('Select the business Name');
    }
  }
  wordCloudNeg()
  {
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetWordCloudNeg,{'b_name':this.b_name}).subscribe(data =>
        {
          this.wordDataPosObj=data;
          
          this.wordData=this.wordDataPosObj['data'];
          let j=0;
          this.wordDataPos=[];
          for(let i in this.wordData)
          {
              this.wordDataPos[j]={weight:this.wordData[i][1],text:this.wordData[i][0],color:this.colors[j%6]};
              j++;
          }
          
          this.optionsCloud= {
            // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
            width: 1000,
            height: 400,
            overflow: false,
          };
        },
        err => {
          console.log(err);
        });
      
      
    }
    else{
      alert('Select the business Name');
    }
  }
  getAllReviewsIntervals()
  { 
    if(this.b_name!= undefined)
    {
      console.log({"b_name":this.b_name,"initial_date":this.date_data.get('date1').value, "final_date": this.date_data.get('date2').value})
      this.dataService.postConfig(this.urlGetIntervalReviews,{"b_name":this.b_name,"initial_date":String(this.date_data.get('date1').value), "final_date": String(this.date_data.get('date2').value)}).subscribe(data =>
      {
        if(data==null)
        {

        }
        this.review=data;
        let j=0;
        for(let i in this.review['data'])
        {
          //console.log(this.review['data'][i]);
          this.reviewInterval.push({'username':this.review['data'][i]['user'],'logo':this.logo[j%2],'review':this.review['data'][i]['review'] });
          j++;
        }
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }  
  }
  getSatisfactionGraph(){
    
    this.allReview='';
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetSatisfactionData,{'b_name':this.b_name}).subscribe(data =>
      {
        console.log(data);
        var j=0;
        this.graphData=data;
        for(let i in this.graphData['data'])
        {
          this.keywordsData.push([i,this.graphData['data'][i][0],this.graphData['data'][i][1]])
          
        }
        this.dataItems=['ambience','place','quality','restaurant','cafe','attitude','menu','beverage','food','location','service']
        
        
       
        
        
      },
      err => {
        console.log(err);
      });
    }
    else{
      alert('Select the business Name');
    }
  }
  getDate(type:string,event: MatDatepickerInputEvent<Date>) {
    if(type =='date1')
    {
      this.date_data.get('date1').patchValue(event.value)
      //console.log(this.date_data.get('date1').value)
    }
    else if(type =='date2')
    {
      this.date_data.get('date2').patchValue(event.value)
      //console.log(this.date_data.get('date2').value)
    }
    
  }
  getSatisfaction(keyword)
  {
    this.satisfactionKeyword = this.graphData['data'][keyword][0]
    if(this.satisfactionKeyword>=0 && this.satisfactionKeyword<20)
    {
      this.outColor='#ff0015'
      this.inColor='#ff606d'
      
    }
    else if(this.satisfactionKeyword>=20 && this.satisfactionKeyword<50)
    {
      this.outColor='#fd7800'
      this.inColor='#f8aa7e'
      
    }
    else if(this.satisfactionKeyword>=50 && this.satisfactionKeyword<75)
    {
      this.outColor='#FDB900'
      this.inColor='#f8d797'
    }
    else if(this.satisfactionKeyword>=75 && this.satisfactionKeyword<=100)
    {
      this.outColor='#78C000'
      this.inColor='#C7E596'
    }
    
  }
  getTopFivePosNeg(){
    this.allReview='';
    if(this.b_name!= undefined)
    {
        this.router.navigate(['/grid'])
    }
    else{
      alert('Select the business Name');
    }
  }
  graphAllReviewsOverTime()
  {
    this.allReview='';
    if(this.b_name!= undefined)
    {
      this.dataService.postConfig(this.urlGetReviewsOverTime,{'b_name':this.b_name}).subscribe(data =>
      {
      
        var j=0;
        this.graphData=data;
        
        
        this.titleHist="Rating Over Time";
        this.typeHist="LineChart";
        this.optionsHist = {   
          hAxis: {
            title: 'Time'
          },
          vAxis:{
            title: 'Ratings'
          },
          curveType: 'function',
          legend: { position: 'bottom' },
          explorer: {axis: 'horizontal'}
        };
        this.widthHist = 720;
        this.heightHist = 400;
        //console.log(this.graphData);
        for(let i=0;i<this.graphData['data'].length;i++)
        {
          let row=[];
          row[1] = Number(this.graphData['data'][i]['predicted_rating']);
          row[0] = this.graphData['data'][i]['created_at'];
          //console.log(row)
          this.dataHist[j]=row;
          
          j++; 
        }
        //console.log(this.dataHist);
        this.columnNamesHist[0]= "Time";
        this.columnNamesHist[1]= "Rating";
      
        
       
        
        
      },
      err => {
        console.log(err);
      });

      
      
       
        
    }
  }
}