import { Component, OnInit } from '@angular/core';
import { Match, TeamInTable } from './open-liga-db.interfaces';
import { OpenLigaDbService } from './open-liga-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  teams: TeamInTable[] = [];
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

      this.teams = [];

      // generate table elements
      for (const dat of data) {
        let team: TeamInTable = dat;
        this.teams.push(team);
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
    this.ligaService.getCompleteSeason(this.selectedSeason).subscribe(data => {
      
      this.listOfGamesFromSelectedTeam = [];

      // generate table from service data
      for (const dat of data) {
        let match: Match = dat;
        
        // if one of the teams from the match is my selected team, add to list
        if(match.Team1.TeamId == this.selectedTeam.TeamInfoId || match.Team2.TeamId == this.selectedTeam.TeamInfoId) 
          this.listOfGamesFromSelectedTeam.push(match)
      }

    },
    error => {
      this.error = error;
    });
  }

}


