import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'BalanceOverviewWebPartStrings';
import BalanceOverview from './components/BalanceOverview';
import { IBalanceOverviewProps } from './components/IBalanceOverviewProps';
import { getPossumBalance, updatePossumBalance } from '../../data/possum-data';
import { AadHttpClient } from '@microsoft/sp-http';

export interface IBalanceOverviewWebPartProps {
  description: string;
}

export default class BalanceOverviewWebPart extends BaseClientSideWebPart<IBalanceOverviewWebPartProps> {
  private financeHttpClient: AadHttpClient;

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: any) => void): void => {
      this.context.aadHttpClientFactory
        .getClient('https://possumpete-api.azurewebsites.net')
        .then((_financeHttpClient: AadHttpClient): void => {
          this.financeHttpClient = _financeHttpClient;
          resolve();
        }, (err: any): void => {
          reject(err);
        });
    });
  }

  public render(): void {
    const element: React.ReactElement<IBalanceOverviewProps > = React.createElement(
      BalanceOverview,
      {
        getPossumBalance: getPossumBalance(this.financeHttpClient).bind(this),
        updatePossumBalance: updatePossumBalance(this.financeHttpClient).bind(this)
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
      pages: []
    };
  }
}
