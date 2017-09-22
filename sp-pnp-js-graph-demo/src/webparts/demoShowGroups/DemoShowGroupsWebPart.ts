import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './DemoShowGroupsWebPart.module.scss';
import * as strings from 'DemoShowGroupsWebPartStrings';
import { IDemoShowGroupsWebPartProps } from './IDemoShowGroupsWebPartProps';

import pnp from "sp-pnp-js";

/**
 * Demo: lightweight interface to get type checking in results
 */
interface GroupData {
  displayName: string;
  description: string;
}


export default class DemoShowGroupsWebPartWebPart extends BaseClientSideWebPart<IDemoShowGroupsWebPartProps> {



  /**
   * Initialize the web part.
   */
  protected onInit(): Promise<void> {

    /**
     * Demo: shows setting up the spfx context
     */
    return super.onInit().then(_ => {

      pnp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {

    /**
     * Demo: super simple loading message
     */
    this.domElement.innerHTML = "<div class=\"ms-font-xl ms-fontColor-themeLight\">Loading...</div>";

    /**
     * Demo: query groups, using select for performance to only get the data we need
     * using getAs with our lightweight type "GroupData", defined above, giving us intellisense and type checking of "g"
     */
    pnp.graph.v1.groups.select("displayName", "description").getAs<GroupData[]>().then(g => {

      /**
       * Demo: Nothing wrong with string concatenation for simple cases. Very light-weight, no other libraries needed
       */
      this.domElement.innerHTML = [
        "<div class=\"ms-font-xl ms-fontColor-themePrimary\">My Groups</div>",
        "<div class=\"ms-Grid\">",
        "<div class=\"ms-GridRow\">",
        "<div class=\"ms-Grid-col ms-sm6 ms-md4 ms-lg2\">Display Name</div>",
        "<div class=\"ms-Grid-col ms-sm6 ms-md8 ms-lg10\">Description</div>",
        "</div>",
        g.reduce((s, d) => s + [
          "<div class=\"ms-GridRow\">",
          `<div class=\"ms-Grid-col ms-sm6 ms-md4 ms-lg2\">${d.displayName}</div>`,
          `<div class=\"ms-Grid-col ms-sm6 ms-md8 ms-lg10\">${d.description}</div>`,
          "</div>",
        ].join(""), ""),
        "</table>"
      ].join("");
    });
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
