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
