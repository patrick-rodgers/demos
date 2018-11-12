import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'NovMonthlyWpWebPartStrings';
import NovMonthlyWp from './components/NovMonthlyWp';
import { INovMonthlyWpProps } from './components/INovMonthlyWpProps';

// setup our required polyfills
import "@pnp/polyfill-ie11";

// get the setup method
import { setup as pnpSetup } from "@pnp/common";

export interface INovMonthlyWpWebPartProps {
  description: string;
}

export default class NovMonthlyWpWebPart extends BaseClientSideWebPart<INovMonthlyWpWebPartProps> {

  protected onInit(): Promise<void> {

    // this will be shared across all pnp libraries
    pnpSetup({
      spfxContext: this.context,
    });

    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<INovMonthlyWpProps> = React.createElement(
      NovMonthlyWp,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
