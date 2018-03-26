import { FetchOptions, getGUID, FetchClient, HttpClientImpl } from "@pnp/common";
import { Queryable, ODataParser, RequestContext } from "@pnp/odata";
import { LeaderboardClient } from "net/leaderboardclient";

export interface ILeaderboardData {
    id: string;
    rank: number;
    isCurrentUser: boolean;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    totalPoints: number;
    activeUsersWeekOverWeek:
    {
        previousWeek: number;
        previousWeekPercent: number;
        currentWeek: number;
        currentWeekPercent: number;
        weeklyDelta: number;
        weeklyDeltaPercent: number;
    }[];
}

export interface IMyData {

}

export abstract class LeaderboardBase<GetType = any> extends Queryable<GetType> {

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {
        return this.toUrl() + `?${this._query.getKeys().map(key => `${key}=${this._query.get(key)}`).join("&")}`;
    }


    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    protected toRequestContext<T>(
        verb: string,
        options: FetchOptions,
        parser: ODataParser<T>,
        pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>): Promise<RequestContext<T>> {

        return Promise.resolve({
            batch: null,
            batchDependency: () => null,
            cachingOptions: this._cachingOptions,
            clientFactory: () => new LeaderboardClient(),
            isBatched: false,
            isCached: this._useCaching,
            options: options,
            parser: parser,
            pipeline: pipeline,
            requestAbsoluteUrl: this.toUrlAndQuery(),
            requestId: getGUID(),
            verb: verb,
        });
    }
}

export class Me extends LeaderboardBase<IMyData> {

    constructor(parent: LeaderboardBase<any>, path: string = "me") {
        super();
        this.extend(parent, path);
    }
}

export class All extends LeaderboardBase<ILeaderboardData> {

    constructor(parent: LeaderboardBase<any>, path: string = "leaderboard") {
        super();
        this.extend(parent, path);
    }
}

export interface ILeaderboardMethods {
    me: Me;
    all: All;
}

export class Leaderboard extends LeaderboardBase<any> implements ILeaderboardMethods {

    constructor(base: string) {
        super();
        this._parentUrl = base;
        this._url = base;
    }

    public get me(): Me {
        return new Me(this);
    }

    public get all(): All {
        return new All(this);
    }
}

export const lb: Leaderboard = new Leaderboard("https://teams-leaderboard.azurewebsites.net/api/");
