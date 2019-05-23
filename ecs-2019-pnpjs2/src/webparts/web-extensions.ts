import { IWeb, Web } from "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import { extendFactory } from "@pnp/odata";

declare module "@pnp/sp/src/webs/types" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IWeb {
        getTopFiveLists(): Promise<any[]>;
    }
}

extendFactory(Web, {
    getTopFiveLists: function(this: IWeb): Promise<any[]> {

        // get the top 5 lists sorted by title
        return this.lists.top(5).orderBy("Title")();
    },
});
