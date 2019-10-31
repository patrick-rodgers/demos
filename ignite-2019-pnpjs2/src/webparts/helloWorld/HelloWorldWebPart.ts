import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';

// DEMO: Added: Selective Imports
import { sp } from "@pnp/sp";
// DEMO: NOTE: simple paths inside libraries
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  // DEMO: Added onInit as before 
  protected async onInit(): Promise<void> {

    await super.onInit();

    // DEMO: Calling sp.setup
    sp.setup({ spfxContext: this.context });
  }

  public render(): void {

    this.domElement.innerHTML = `Loading all the lists...`;

    // DEMO: NOTE: invokable, no need to use .get()
    sp.web.lists.select("Title")<{ Title: string }[]>().then(lists => {

      // DEMO: lists is correctly typed as an array
      this.domElement.innerHTML = `<ul>${lists.map(l => `<li>${l.Title}</li>`).join("")}</ul>`;
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
