import { ILeaderboardData } from "model/leaderboard";

export interface IFastTrackTeamsLeaderboardProps {
  items: Promise<ILeaderboardData[]>;
}
