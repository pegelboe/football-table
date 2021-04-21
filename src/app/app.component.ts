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

    this.getTable();

    this.getSeasons();

  }


  /**
   * get table of last game day
   */
  private getTable(season: number = 2017) {
    this.ligaService.getTable(2017).subscribe(data => {

      for (const dat of data) {
        let team: Team = dat;
        this.teams.push(team);
      }

    },
      error => {
        this.error = error;
      });
  }

  /**
   * get table of last game day
   */
   private getSeasons() {
    this.seasons = this.ligaService.getSeasons();
  }

}


