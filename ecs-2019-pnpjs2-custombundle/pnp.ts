// ** import the ambient augmentation
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
// import "@pnp/sp/presets/all";

// export * from "@pnp/sp/presets/all";

import { extendFactory } from "@pnp/odata";
import { IWeb, Web } from "@pnp/sp/src/webs";
import { IItems, Items } from "@pnp/sp/src/items";

declare module "@pnp/sp/src/items/types" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IItems {
        getLastFiveUpdatedItems(): Promise<any[]>;
    }
}

extendFactory(Items, {
    getLastFiveUpdatedItems: function (this: IItems): Promise<any[]> {
        return this.orderBy("Modified", false).top(5)();
    },
});

declare module "@pnp/sp/src/webs/types" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IWeb {
        getTopFiveLists(): Promise<any[]>;
    }
}

extendFactory(Web, {
    getTopFiveLists: function (this: IWeb): Promise<any[]> {

        // get the top 5 lists sorted by title
        return this.lists.top(5).orderBy("Title")();
    },
});

export {
    IWeb,
    Web,
    IWebs,
    Webs,
} from "@pnp/sp/src/webs";

export {
    ILists,
    List,
    IList,
    Lists,
} from "@pnp/sp/src/lists";

export {
    IItems,
    IItem,
    Item,
    Items,
} from "@pnp/sp/src/items";

export {
    sp,
    spGet,
    spPost,
    extractWebUrl,
} from "@pnp/sp";

// just reexport all of these so we have the expected stuff available
// or a subset - but most of this will be bundled anyway so no real savings
// picking and choosing from these core libraries
export * from "@pnp/logging";
export * from "@pnp/common";
export * from "@pnp/odata";
