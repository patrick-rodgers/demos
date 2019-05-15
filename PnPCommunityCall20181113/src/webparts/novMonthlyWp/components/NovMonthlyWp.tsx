import * as React from 'react';
import styles from './NovMonthlyWp.module.scss';
import { INovMonthlyWpProps } from './INovMonthlyWpProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { FuncRunner } from "./FuncRunner";
import { graph } from "@pnp/graph";
import { sp } from "@pnp/sp";

const siteScriptContent = {
  "$schema": "schema.json",
  "actions": [
    {
      "verb": "setRegionalSettings",
      "locale": 1033
    },
    {
      "verb": "addPrincipalToSPGroup",
      "principal": "ContosoAdmins",
      "group": "Owners"
    },
    {
      "verb": "createSPList",
      "listName": "Employees",
      "templateType": 100,
      "subactions": [
        {
          "fieldType": "Text",
          "displayName": "Full name",
          "internalName": "fullName",
          "verb": "addSPField"
        },
        {
          "verb": "setTitle",
          "title": "employees"
        }
      ]
    }
  ],
  "bindata": {},
  "version": 1
};


export default class NovMonthlyWp extends React.Component<INovMonthlyWpProps, {}> {


  public render(): React.ReactElement<INovMonthlyWpProps> {
    return (
      <div>
        <FuncRunner action={this.graphClient} title={"Graph Client:"} />
        <FuncRunner action={this.graphBatching} title={"Graph Batching:"} />
        <FuncRunner action={this.siteScripts} title={"Create and get Site Scripts:"} />
        <FuncRunner action={this.siteDesigns} title={"Create and apply Site Designs:"} />
      </div>
    );
  }

  private graphClient(): Promise<any> {

    return graph.groups.get();
  }



  private graphBatching(): Promise<any> {

    const batch = graph.createBatch();

    graph.groups.inBatch(batch).get();

    graph.me.drives.inBatch(batch).get();

    return batch.execute().then(_ => "Batch Done!");
  }





  private async siteScripts(): Promise<any> {

    await sp.siteScripts.createSiteScript("Demo Site Script 2", "A demo site script", siteScriptContent);

    return sp.siteScripts.getSiteScripts();
  }

  private async siteDesigns(): Promise<any> {

    const siteScript = await sp.siteScripts.createSiteScript("Demo Site Script 5", "A demo site script", siteScriptContent);

    // create a new design 
    const siteDesign = await sp.siteDesigns.createSiteDesign({
      SiteScriptIds: [siteScript.Id],
      Title: "DemoSiteDesign3",
      WebTemplate: "64",
    });

    const webData = await sp.web.select("Url").get();

    return sp.siteDesigns.applySiteDesign(siteDesign.Id, webData.Url);
  }
}
