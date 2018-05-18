import { override } from "@microsoft/decorators";
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from "@microsoft/sp-application-base";
import { Log } from "@microsoft/sp-core-library";
import { sp } from "@pnp/sp";
import * as strings from "PnPjsSimpleHeaderApplicationCustomizerStrings";
import styles from "./styles.module.scss";
const LOG_SOURCE: string = "PnPjsSimpleHeaderApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPnPjsSimpleHeaderApplicationCustomizerProperties {
}

// we use an interface to type our web properties
interface IWebInfo {
  Title: string;
  Created: string;
  LastItemModifiedDate: string;
  LastItemUserModifiedDate: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PnPjsSimpleHeaderApplicationCustomizer
  extends BaseApplicationCustomizer<IPnPjsSimpleHeaderApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // we have to add the config step so we have the appropriate context from which to build our urls
    // do this before we do anything else to ensure it is in place
    sp.setup({
      spfxContext: this.context,
    });

    // added to handle possible changes on the existence of placeholders.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve<void>();
  }

  private _renderPlaceHolders(): void {

    // handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // the extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      // here we will render a placeholder message while we load things, then update the content once we have our data
      // we could easily use react or any other framework here but we've kept things simple for this demo.

      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
        <div class="${styles.app}">
          <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.top}">
            <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> Loading...
          </div>
        </div>`;

        // we are selecting some web properties to show use of the select method
        sp.web.select("Title", "Created", "LastItemModifiedDate", "LastItemUserModifiedDate").get<IWebInfo>().then(webInfo => {

          const msg: string = `Web ${webInfo.Title} was created on 
            ${this.formatDate(webInfo.Created)}. The last user item modification was on 
            ${this.formatDate(webInfo.LastItemUserModifiedDate)} and the last overall update was on 
            ${this.formatDate(webInfo.LastItemModifiedDate)}.`;

          // we are replacing all the content as a string. Again, this could be built with a framework such as React, Knockout, or others.
          this._topPlaceholder.domElement.innerHTML = `
            <div class="${styles.app}">
              <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.top}">
                <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${msg}
              </div>
            </div>`;
        });

      } else {
        console.log("No this._topPlaceholder.domElement");
      }
    }
  }

  private formatDate(s: string): string {
    const d: Date = new Date(s);
    return d.toDateString();
  }

  private _onDispose(): void {
    console.log("[PnPjsSimpleHeaderApplicationCustomizer._onDispose] Disposed custom top placeholder.");
  }
}
