import { IItems, Items } from "@pnp/sp/src/items";
import "@pnp/sp/src/lists/web";
import { extendFactory } from "@pnp/odata";

declare module "@pnp/sp/src/items/types" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IItems {
        getLastFiveUpdatedItems(): Promise<any[]>;
    }
}

extendFactory(Items, {
    getLastFiveUpdatedItems: function(this: IItems): Promise<any[]> {
        return this.orderBy("Modified", false).top(5)();
    },
});
