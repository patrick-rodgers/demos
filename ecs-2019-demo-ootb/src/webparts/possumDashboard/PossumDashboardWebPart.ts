import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from 'PossumDashboardWebPartStrings';
import PossumDashboard from './components/PossumDashboard';
import { IPossumDashboardProps } from './components/PossumDashboard';
import { HttpClient } from "@microsoft/sp-http";
import { listClientBind, detailClientBind } from "../../data/possum-data";

export default class PossumDashboardWebPart extends BaseClientSideWebPart<{}> {

  public render(): void {

    const element: React.ReactElement<IPossumDashboardProps> = React.createElement(
      PossumDashboard,
      <IPossumDashboardProps>{
        loadPossums: listClientBind(this.context.spHttpClient),
        loadPossum: detailClientBind(this.context.spHttpClient),
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
