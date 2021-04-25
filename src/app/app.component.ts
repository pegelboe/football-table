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
  allMatchesOfSeason: Match[] = null;
  listOfMatchesFromSelectedTeam: Match[] = [];
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
    this.listOfMatchesFromSelectedTeam = [];
    this.allMatchesOfSeason = undefined;
    this.selectedTeam = undefined;
  }

  /**
   * on team change get all matches of the team from all season-matches
   */
  public async onTeamChange(): Promise<void> {

    this.cleanTable();

    // get all season matches, if not alrady present
    if(this.allMatchesOfSeason == undefined) 
      this.allMatchesOfSeason = await this.getAllMatchesOfSeason();

    this.showMatchesForSelectedTeam();
  }

  /**
   * Get all matches of the season
   */
  private async getAllMatchesOfSeason(): Promise<Match[]> {
    let data = await this.ligaService.getCompleteSeason(this.selectedSeason).toPromise();

    this.allMatchesOfSeason = [];
    let matches: Match[] = [];

    for (const dat of data) {
      let match: Match = dat;
      matches.push(match);
    }

    return matches;
  }

  /**
   * get all matches of selected season for selected team 
   * and calculate points won against each other team of the league
   */
  private showMatchesForSelectedTeam(): void {
    this.listOfMatchesFromSelectedTeam = [];
    let pointsForMeInMatch: number = 0;
    let myTeamIsAwayTeam: boolean = false;
    this.error = "";

    if(this.allMatchesOfSeason == undefined) {
      this.error = "no mathes for season loaded!"; 
      return
    }

    // generate table from service data
    for (const match of this.allMatchesOfSeason) {
      pointsForMeInMatch = 0;
      
      // not a match in which the selected team is? -> next
      if(match.Team1.TeamId != this.selectedTeam.TeamInfoId && match.Team2.TeamId != this.selectedTeam.TeamInfoId)
        continue;

      // match with selected team? add to list
      this.listOfMatchesFromSelectedTeam.push(match)

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


