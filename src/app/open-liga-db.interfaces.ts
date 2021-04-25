
/**
 * Teams do have a different interface in open-liga-db
 * for table and for matches; so we have to create two interfaces as well.
 */
export interface TeamInTable {
  TeamName: string;
  Points: number;
  Goals: number;
  OpponentGoals: number;
  TeamInfoId: number;
  PointsAgainstSelectedTeam: number;  // Added by me
}

/**
 * Teams do have a different interface in open-liga-db
 * for table and for matches; so we have to create two interfaces as well.
 */
export interface TeamInMatch {
  TeamId: number;
  TeamName: string;
}

export interface MatchResult {
  ResultOrderID: number; // 1=Halftime; 2=Final
  PointsTeam1: number;
  PointsTeam2: number;
}

export interface Match {
  MatchId: number
  Group: {
    GroupOrderID: number; // GameDay
  }
  MatchResults: MatchResult[];  // length=2
  Team1: TeamInMatch;
  Team2: TeamInMatch;
}