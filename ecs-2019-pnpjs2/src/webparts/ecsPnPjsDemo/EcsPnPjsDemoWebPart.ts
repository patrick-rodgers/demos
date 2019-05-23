import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './EcsPnPjsDemoWebPart.module.scss';
import * as strings from 'EcsPnPjsDemoWebPartStrings';

import { sp } from "@pnp/sp/presets/all";

// show difference in selective imports
// import { sp } from "@pnp/sp";
// import "@pnp/sp/src/webs";

// show extension methods
// import "../web-extensions";

// show deep extension methods
// import "../item-extensions";

export interface IEcsPnPjsDemoWebPartProps {
  description: string;
}

export default class EcsPnPjsDemoWebPart extends BaseClientSideWebPart<IEcsPnPjsDemoWebPartProps> {

  public async onInit(): Promise<void> {
    await super.onInit();

    // setup 
    sp.setup({
      spfxContext: this.context,
    });
  }

  public async render(): Promise<void> {
    this.domElement.innerHTML = "<p>Loading...</p>";

    // super simple case
    // note invokable
    // note dealing with an interface here
    const d = await sp.web();

    // use of factory to get the interface loaded
    // const d = await Web(this.context.pageContext.web.absoluteUrl).lists.select("Title", "Created")();

    // web extensions
    //const d = await sp.web.getTopFiveLists();

    // item extensions
    // const d = await sp.web.lists.getByTitle("OrderByList").items.getLastFiveUpdatedItems();

    // amazing rendering!!!
    this.domElement.innerHTML = `<pre>${JSON.stringify(d, null, 2)}</pre>`;
  }
   
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
