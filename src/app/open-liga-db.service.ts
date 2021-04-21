import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenLigaDbService {

  private seasons: number[] = [2015,2016,2017,2018,2019,2020];

  constructor(private http: HttpClient) { }

  /**
   * get table of last game day of given season
   * @param season 
   * @returns 
   */
  public getTable(season: number): Observable<any> {

    if(season == undefined)
      return throwError("no season given. Can't get table");

    if(this.seasons.find(s=>s == season) == undefined)
      return throwError("unknown season!");
      
    return this.http.get(`https://www.openligadb.de/api/getbltable/bl1/${season}`);
  }

  /**
   * get all matches for given season
   * @param season 
   * @returns 
   */  
  public getCompleteSeason(season: number): Observable<any> {

    if(season == undefined)
      return throwError("no season given. Can't get table");

    if(this.seasons.find(s=>s == season) == undefined)
      return throwError("unknown season!");
      
    return this.http.get(`https://www.openligadb.de/api/getmatchdata/bl1/${season}`);
  }

  /**
   * get all available seasons
   * @returns 
   */
  public getSeasons(): number[] {
    return this.seasons;
  }

}
