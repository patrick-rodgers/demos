import { SPHttpClient } from "@microsoft/sp-http";
import { IPossumListData, IPossumDetailData, IPossumStatus } from "./types";

export function listClientBind(client: SPHttpClient): () => Promise<IPossumListData[]> {

    return async (): Promise<IPossumListData[]> => {

        // const response = await client.get(`/_api/web/lists/getByTitle('Possums')/items?$select=Title,ID`, SPHttpClient.configurations.v1);
        const list = await getPossumStatusList(client);

        return Array.from(list.reduce((p, c) => {
            if (!p.has(c.ID)) {
                p.set(c.ID, {
                    ID: c.ID,
                    Status: c,
                    Title: c.Name,
                });
            }
            return p;
        }, new Map<number, IPossumListData>()), v => v[1]);
    };
}

export function detailClientBind(client: SPHttpClient): (id: number) => Promise<IPossumDetailData> {

    return async (id: number): Promise<IPossumDetailData> => {

        const response = await client.get(`https://officedevpnp.sharepoint.com/sites/PossumPete/_api/web/lists/getByTitle('Possums')/items(${id})`, SPHttpClient.configurations.v1);

        if (response.ok) {
            const raw = await response.clone().json();

            const details: Partial<IPossumDetailData> = {
                ArrivalDate: raw.ArrivalDate,
                ID: raw.ID,
                Title: raw.Title,
                FavoriteFood: raw.FavoriteFood,
            };

            // now we need to merge in the status list
            const statusHistory = await getPossumStatusList(client);
            details.StatusHistory = statusHistory.filter(h => h.ID === details.ID);
            // and we update the current status with the most recent
            if (details.StatusHistory.length > 0) {
                details.Status = details.StatusHistory[0];
            }

            // recast now that we have built the full object
            return <IPossumDetailData>details;

        } else {
            console.error(await response.clone().text());
            throw Error(`Error retrieving the possum detail data for id ${id}.`);
        }
    };
}

export async function getPossumStatusList(client: SPHttpClient): Promise<IPossumStatus[]> {

    // now we need to get the status for each possum which we do like so:
    const response = await client.get(`https://officedevpnp.sharepoint.com/sites/PossumPete/_api/web/lists/getByTitle('PossumStatus')/items?$select=Status,Details,Modified,Possum/ID,Possum/Title&$expand=Possum&$orderby=Created desc`, SPHttpClient.configurations.v1);

    if (response.ok) {
        const raw: { value: any[] } = await response.clone().json();
        return raw.value.map(d => <IPossumStatus>{
            ID: d.Possum.ID,
            Name: d.Possum.Title,
            Details: d.Details,
            Modified: d.Modified,
            Status: d.Status,
        });
    }

    console.error(await response.clone().text());
    throw Error(`Error retrieving the possum status list.`);
}
