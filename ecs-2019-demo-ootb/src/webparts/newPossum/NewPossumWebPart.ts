import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewPossumWebPartStrings';
import NewPossum from './components/NewPossum';
import { INewPossumProps } from './components/INewPossumProps';
import { graph } from "@pnp/graph";

export interface INewPossumWebPartProps {
  description: string;
}

export default class NewPossumWebPart extends BaseClientSideWebPart<INewPossumWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      graph.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<INewPossumProps > = React.createElement(
      NewPossum,
      {
        msGraphClientFactory: this.context.msGraphClientFactory,
        aadHttpClientFactory: this.context.aadHttpClientFactory
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
