import { IPossumBalance } from "../../../data/types";

export interface IBalanceOverviewState {
  balanceData: IPossumBalance[];
  loading: boolean;
  loadingError?: string;
  newBalancePossum?: string;
  newBalance?: string;
  updating: boolean;
  updatingError?: string;
}