import { AuthenticationResult, ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import nodeFetch, { Response } from "node-fetch";
import { graphMSALInit, spMSALInit } from "./settings.js";

const spClient = new ConfidentialClientApplication(spMSALInit.init);
const graphClient = new ConfidentialClientApplication(graphMSALInit.init);

export async function spFetch(url: string, init: RequestInit = { method: "GET" }): Promise<Response> {

    init.headers = { ...init.headers, "Content-Type": "application/json", "Accept": "application/json" };

    return fetch(url, init, () => spClient.acquireTokenByClientCredential({ scopes: spMSALInit.scopes }));
}

export async function graphFetch(url: string, init: RequestInit = { method: "GET" }): Promise<Response> {

    init.headers = { ...init.headers, "Content-Type": "application/json" };

    return fetch(url, init, () => graphClient.acquireTokenByClientCredential({ scopes: graphMSALInit.scopes }));
}

async function fetch(url: string, init: RequestInit, getToken: () => Promise<AuthenticationResult>): Promise<Response> {

    const token = await getToken();

    init.headers = { ...init.headers, "Authorization": `${token.tokenType} ${token.accessToken}` };

    console.info(`[${init.method}] ${url}`);

    return nodeFetch(url, <any>init);
}
