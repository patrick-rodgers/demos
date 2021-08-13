import { encodeSharingUrl } from "./utils.js";
import { spFetch } from "./fetch.js";
import { combine, isArray, isUrlAbsolute } from "@pnp/common";
import { UnfurledLinkInfo } from "./types";

const errSink = () => void (0);

/**
 * [Officially unsupported] Allows you to get embedding information for a given link
 * 
 * @param url 
 * @returns 
 */
export async function unfurlByEmbedService(url: string): Promise<UnfurledLinkInfo> {

    const parsedUrl = new URL(url);

    const r = await spFetch(`https://${parsedUrl.host}/_api/SP.Publishing.EmbedService/EmbedData?version=1&url='${encodeURIComponent(url)}'`);

    if (r.ok) {

        const data = await r.json();

        let thumbnailUrl = data.ThumbnailUrl;

        if (!isUrlAbsolute(thumbnailUrl)) {

            const webUrl = new URL(data.Url);
            thumbnailUrl = combine(`${webUrl.protocol}://${webUrl.host}`, webUrl.pathname, thumbnailUrl);
        }

        return {
            url,
            title: data.Title,
            description: data.Description || "",
            thumbnailUrl,
        }

    } else {

        const err = await r.text();

        throw new Error(err);
    }
   
    return;
}
