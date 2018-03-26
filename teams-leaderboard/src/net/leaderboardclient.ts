import {
    RequestClient,
    FetchOptions,
    HttpClientImpl,
    FetchClient,
    mergeOptions,
    extend,
} from "@pnp/common";

export class LeaderboardClient implements RequestClient {

    private _impl: HttpClientImpl;

    constructor() {
        this._impl = new FetchClient();
    }

    public fetch(url: string, options?: FetchOptions): Promise<Response> {

        mergeOptions(options, {
            credentials: "include"
        });

        return this.fetchRaw(url, options);
    }

    public fetchRaw(url: string, options?: FetchOptions): Promise<Response> {
        return this._impl.fetch(url, options);
    }

    public get(url: string, options?: FetchOptions): Promise<Response> {
        const opts: FetchOptions = extend(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options?: FetchOptions): Promise<Response> {
        const opts: FetchOptions = extend(options, { method: "POST" });
        return this.fetch(url, options);
    }

    public patch(url: string, options?: FetchOptions): Promise<Response> {
        const opts: FetchOptions = extend(options, { method: "PATCH" });
        return this.fetch(url, options);
    }

    public delete(url: string, options?: FetchOptions): Promise<Response> {
        const opts: FetchOptions = extend(options, { method: "DELETE" });
        return this.fetch(url, options);
    }
}