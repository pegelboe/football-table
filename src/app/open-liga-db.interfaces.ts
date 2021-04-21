export interface TeamInTable {
    TeamName: string;
    Points: number;
    Goals: number;
    OpponentGoals: number;
    TeamInfoId: number;
  }
  
  export interface TeamInMatch {
    TeamId: number;
    TeamName: string;
  }
  
  export interface MatchResult {
    ResultOderId: number; // 1=Halftime; 2=Final
    PointsTeam1: number;
    PointsTeam2: number;
  }
  
  export interface Match {
    Group: {
      GroupOrderID; // GameDay
    }
    MatchResults: MatchResult[];  // length=2
    Team1: TeamInMatch;
    Team2: TeamInMatch;
  }