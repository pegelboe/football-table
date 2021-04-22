import { Component, OnInit } from '@angular/core';
import { Match, TeamInTable } from './open-liga-db.interfaces';
import { OpenLigaDbService } from './open-liga-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  teamsTable: TeamInTable[] = [];
  selectedTeam: TeamInTable = null;
  seasons: number[] = [];
  selectedSeason: number = null;
  listOfGamesFromSelectedTeam: Match[] = [];
  error: string = "";

  constructor(private ligaService: OpenLigaDbService) {}

  ngOnInit(): void {
    this.getSeasons();

    this.getTable(this.selectedSeason);
  }

  /**
   * get all available seasons and select first one
   */
   private getSeasons(): void {
    this.seasons = this.ligaService.getSeasons();

    // select first available element
    if(this.selectedSeason == undefined && this.seasons.length > 0)
      this.selectedSeason = this.seasons[0];
  }

  /**
   * get table of last game day for given season
   */
  private getTable(season: number): void {

    // is this a valid season 
    if(this.seasons.find(s=>s == season) == undefined) {
      this.error = "unknown season!";
      return;
    }

    // get table for this season
    this.ligaService.getTable(season).subscribe(data => {

      this.teamsTable = [];

      // generate table elements
      for (const dat of data) {
        let team: TeamInTable = dat;
        this.teamsTable.push(team);
      }

    },
    error => {
      this.error = error;
    });
  }

  /**
   * act on season change
   */
  public onSeasonChange(): void {
    this.getTable(this.selectedSeason);
    this.listOfGamesFromSelectedTeam = [];
  }

  /**
   * on team change get all games of the season and extract all games from selected team
   */
  public onTeamChange(): void {

    this.cleanTable();

    this.ligaService.getCompleteSeason(this.selectedSeason).subscribe(data => {
      
      this.listOfGamesFromSelectedTeam = [];
      let pointsForMeInMatch: number = 0;
      let myTeamIsAwayTeam: boolean = false;
      this.error = "";

      // generate table from service data
      for (const dat of data) {
        let match: Match = dat;
        pointsForMeInMatch = 0;
        
        // not a match in which the selected team is? -> next
        if(match.Team1.TeamId != this.selectedTeam.TeamInfoId && match.Team2.TeamId != this.selectedTeam.TeamInfoId)
          continue;

        // match with selected team? add to list
        this.listOfGamesFromSelectedTeam.push(match)

        // is the team we are looking for stats the home team?
        if(match.Team2.TeamId == this.selectedTeam.TeamInfoId) 
          myTeamIsAwayTeam = true;
        else
          myTeamIsAwayTeam = false;

        let finalResult = match.MatchResults.find(mr => mr.ResultOrderID == 2);
        // draw
        if(finalResult.PointsTeam1 == finalResult.PointsTeam2)
          pointsForMeInMatch = 1;
        // home team wins and my team is the home team -> points for me
        else if(finalResult.PointsTeam1 > finalResult.PointsTeam2 && !myTeamIsAwayTeam) 
           pointsForMeInMatch = 3;
        // away team wins and my team is the away team -> points for me
        else if(finalResult.PointsTeam1 < finalResult.PointsTeam2 && myTeamIsAwayTeam) 
          pointsForMeInMatch = 3;

        // no points for me in this match :() => next
        if(pointsForMeInMatch == 0)
          continue;

        // get the oponent from the table and add the points they got in this match
        let opponentTeamId = myTeamIsAwayTeam ? match.Team1.TeamId : match.Team2.TeamId;
        let opponent: TeamInTable = this.teamsTable.find(t => t.TeamInfoId == opponentTeamId);
        opponent.PointsAgainstSelectedTeam += pointsForMeInMatch;
      }

    },
    error => {
      this.error = error;
    });
  }

  /**
   * set PointsAgainstSelectedTeam to 0 for each team in table
   */
  private cleanTable(): void {
    for (const team of this.teamsTable) {
      team.PointsAgainstSelectedTeam = 0;
    }
  }

}


