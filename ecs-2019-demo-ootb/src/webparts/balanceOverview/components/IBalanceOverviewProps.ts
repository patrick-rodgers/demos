import { IPossumBalance } from "../../../data/types";

export interface IBalanceOverviewProps {
  getPossumBalance: () => Promise<IPossumBalance[]>;
  updatePossumBalance: (possum: string, newBalance: number) => Promise<IPossumBalance[]>;
}
