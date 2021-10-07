import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'IFrameSampleWebPartStrings';

export interface IIFrameSampleWebPartProps {
  description: string;
}

export default class IFrameSampleWebPart extends BaseClientSideWebPart<IIFrameSampleWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `<iframe title="Bing!" src="https://www.bing.com?email='${encodeURIComponent(this.context.pageContext.user.email)}'"></iframe>`;
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
