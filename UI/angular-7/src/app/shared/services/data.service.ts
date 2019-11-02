import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
//import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  
};
@Injectable()
export class DataService {
  
  constructor(private http: HttpClient) { }
  

  getConfig(url) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'}); 
    return this.http.get(url,{responseType: 'json',headers});
    
  }
  postConfig(url,data)
  {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',  
        'Access-Control-Allow-Origin':'*',
      })
    };
    return this.http.post(url, data, httpOptions);
    
  }

  
}
