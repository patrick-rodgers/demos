import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "FastTrackTeamsLeaderboardWebPartStrings";
import FastTrackTeamsLeaderboard from "./components/FastTrackTeamsLeaderboard";
import { IFastTrackTeamsLeaderboardProps } from "./components/IFastTrackTeamsLeaderboardProps";
import { lb, ILeaderboardData } from "model/leaderboard";
import { ICachingOptions } from "@pnp/odata";
import { dateAdd } from "@pnp/common";

export interface IFastTrackTeamsLeaderboardWebPartProps {
  description: string;
}

export default class FastTrackTeamsLeaderboardWebPart extends BaseClientSideWebPart<IFastTrackTeamsLeaderboardWebPartProps> {

  public render(): void {

    const element: React.ReactElement<IFastTrackTeamsLeaderboardProps> = React.createElement(
      FastTrackTeamsLeaderboard,
      {
        items: this.getLeaderboard(),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  // a TODO:: is there anything we need to set here?
  // page size?
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
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private getLeaderboard(): Promise<ILeaderboardData[]> {

    // we use local storage caching since this data doesn't change frequently
    const cacheOptions: ICachingOptions = {
      key: "5a574748-35a7-41d5-a6a3-79446fe4d8f1",
      storeName: "local",
      expiration: dateAdd(new Date(), "minute", 30),
    };

    return lb.all.usingCaching(cacheOptions).get();
  }
}
