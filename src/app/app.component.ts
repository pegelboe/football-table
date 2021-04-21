import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { OpenLigaDbService } from './open-liga-db.service';

export interface Team {
  TeamName: string;
  Points: number;
  Goals: number;
  OpponentGoals: number;
  TeamInfoId: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam = null;
  seasons: number[] = [];
  selectedSeason = null;
  error: string = "";

  constructor(private ligaService: OpenLigaDbService) {}

  ngOnInit(): void {

    this.getSeasons();

    this.getTable(this.selectedSeason);
  }

  /**
   * get table of last game day
   */
   private getSeasons() {
    this.seasons = this.ligaService.getSeasons();

    // select first available element
    if(this.selectedSeason == undefined && this.seasons.length > 0)
        this.selectedSeason = this.seasons[0];
  }

  /**
   * get table of last game day
   */
  private getTable(season: number = 2017) {
    this.ligaService.getTable(season).subscribe(data => {

      this.teams = [];

      // generate table from service data
      for (const dat of data) {
        let team: Team = dat;
        this.teams.push(team);
      }

      // select first available element
      if(this.selectedTeam == undefined && this.teams.length > 0)
        this.selectedTeam = this.teams[0];
    },
    error => {
      this.error = error;
    });
  }

  /**
   * act on season change
   */
  public onSeasonChange() {
    this.getTable(this.selectedSeason);
  }

  /**
   * act on team change
   */
  public onTeamChange() {
    let test = this.selectedTeam;
  }


}


