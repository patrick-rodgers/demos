import { NumericDictionary } from "lodash";

export interface IPossumStatus {
    ID: number;
    Name: string;
    Status: string;
    Details: string;
    Modified: string;
}

export interface IPossumListData {
    ID: number;
    Title: string;
    Status: IPossumStatus;
}

export interface IPossumDetailData extends IPossumListData {
    ArrivalDate: string;
    FavoriteFood: string;
    StatusHistory: IPossumStatus[];
}
