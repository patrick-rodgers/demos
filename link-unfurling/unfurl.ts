import { encodeSharingUrl } from "./utils.js";
import { spFetch } from "./fetch.js";
import { combine, isArray } from "@pnp/common";

const errSink = () => void (0);

export async function unfurl(url: string): Promise<UnfurledLinkInfo> {

    const parsedUrl = new URL(url);

    // these url templates allow us to access either the item via the v2.0 api
    // we can create urls of the form https://{teant host}/_api/v2.0/sharePoint:/server/relative/path/file.aspx
    const itemUrl = `https://${parsedUrl.host}/_api/v2.0/sharePoint:/${encodeURIComponent(parsedUrl.pathname.replace(/^\//, ""))}`;
    // or access the item as a v2.0 sharing item, i.e. a sharing link someone got from using the Share dialog
    const sharesBaseUrl = `https://${parsedUrl.host}/_api/v2.0/shares/`;

    // this works for everything except sharing urls
    const response = await spFetch(itemUrl);

    if (!response.ok) {

        // if the response is not ok, we likely have a sharing link that doesn't work in the itemUrl template above
        const shareUrl = combine(sharesBaseUrl, encodeSharingUrl(url), "driveItem");

        const detailsResponse = await spFetch(shareUrl).catch(errSink);

        const details = await detailsResponse.json().catch(errSink);

        // this doesn't work specifically with Site Pages, so we will get what we can
        if (details.error && details.error.message && details.error.message === "Site Pages cannot be accessed as a drive item") {

            // we can get a file name this way for the share
            const basicsResponse = await spFetch(combine(sharesBaseUrl, encodeSharingUrl(url)));

            const basics = await basicsResponse.json();

            return {
                url,
                title: basics.name,
                description: "",
                thumbnailUrl: "",
            }
        }

        // we get our thumbnails by appending "thumbnails" so the share link as drive item url
        // this approach works for all shared docs EXCEPT site pages
        const thumbnailUrl = await processThumbnailQuery(combine(shareUrl, "thumbnails"));

        return {
            url,
            title: details.name,
            description: "",
            thumbnailUrl,
        };

    } else {

        // our response is OK so let's read the json we got
        const data: Record<string, any> = await response.json();

        if (data["@odata.context"].indexOf("$metadata#sites/$entity") > -1) {

            // we have a link to a web, so we need to get its information to display

            // to do that we need to fall back to the v1.0 SharePoint api to get the SiteLogoUrl
            const webDataResponse = await spFetch(combine(`${data.webUrl}`, "_api/web/?$select=Title,Description,SiteLogoUrl"));

            const webData = await webDataResponse.json();

            const webUrl = new URL(data.webUrl);

            return {
                url,
                title: webData.Title,
                description: webData.Description,
                // site logo urls are server relative so we make it absolute in the return
                thumbnailUrl: combine(`https://${webUrl.host}`, webData.SiteLogoUrl),
            }

        } else if (data["@odata.context"].indexOf("$metadata#listItems/$entity") > -1) {

            // we have a document in a library

            // optional check to see if it is a site page
            const sitePage = isSitePage(data);

            // we append the driveitem thumbnails path to our v2.0 query path to read thumbnails
            const thumbnailUrl = await processThumbnailQuery(itemUrl.concat(":/driveItem/thumbnails/"));

            return {
                url,
                title: data.fields.Title || data.fields.FileLeafRef,
                description: data.fields.Description || "",
                thumbnailUrl,
            };
        }
    }
}

/**
 * Example utility function for determing if a file is a site page
 */
function isSitePage(data: { contentType?: { name: string, id: string } }): boolean {

    // here we are checking the content type data to see if we have a site page
    return data.contentType && (data.contentType.name === "SitePage" || data.contentType.id.startsWith("0x0101009D1CB255DA76424F860D91F20E6C4118");
}


/**
 * Given a suitable url handles the logic to request and return a single thumbnail url, if available
 * 
 * @param url The url to which we will make our request
 * @returns Absolute url to a thumbnail
 */
async function processThumbnailQuery(url: string): Promise<string> {

    const thumbnailResponse = await spFetch(url).catch<Response>(errSink);

    let thumbnailUrl = "";

    if (thumbnailResponse && thumbnailResponse.ok) {

        const thumbnails = await thumbnailResponse.json();

        if (isArray(thumbnails.value) && thumbnails.value.length > 0) {
            thumbnailUrl = thumbnails.value[0].medium.url;
        }
    }

    return thumbnailUrl;
}

/**
 * Represents the information found to unfurl a url
 */
export interface UnfurledLinkInfo {
    /**
     * The url to a thumbnail as best we were able to determine
     */
    thumbnailUrl: string | null;
    /**
     * Any title we are able to find
     */
    title: string;
    /**
     * Any description we were able to find
     */
    description: string;
    /**
     * Original url provided to unfurl
     */
    url: string;
}
