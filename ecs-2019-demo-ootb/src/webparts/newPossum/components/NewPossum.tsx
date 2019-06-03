import * as React from 'react';
import styles from './NewPossum.module.scss';
import { INewPossumProps } from './INewPossumProps';
import { INewPossumState } from './INewPossumState';
import { AadHttpClient, HttpClientResponse, IHttpClientOptions, MSGraphClient } from '@microsoft/sp-http';
import { graph } from "@pnp/graph";
import { FieldValueSet } from '@microsoft/microsoft-graph-types';

export default class NewPossum extends React.Component<INewPossumProps, INewPossumState> {
  constructor(props: INewPossumProps) {
    super(props);
    this.state = { title: "", arrivalDate: "", favoriteFood: "", result: "" };
  }

  public render(): React.ReactElement<INewPossumProps> {
    return (
      <div className={styles.newPossum}>
        <form className={styles.container} onSubmit={this.saveUsingPnPjs.bind(this)}>
          <div className={styles.row}>
            <div className={styles.column}>
              <legend className={styles.title}>Add new possum to the list</legend>
              <input type="text" placeholder="Name" name="title" onChange={this.handleInputChange.bind(this)} />
              <input type="text" placeholder="ArrivalDate" name="arrivalDate" onChange={this.handleInputChange.bind(this)} />
              <input type="text" placeholder="Favorite Food" name="favoriteFood" onChange={this.handleInputChange.bind(this)} />
              <button className={styles.button} type="submit">Save</button>
            </div>
          </div>
          {this.state.result}
        </form>
      </div>
    );
  }

  private saveUsingMsGraphClient(e: React.ChangeEvent<any>): void {
    e.preventDefault();

    const siteId: string = "officedevpnp.sharepoint.com,8a5649fd-3b86-4ed2-aa18-80382f78fb43,0e3dada5-cca3-41ef-93fb-93934d5a4f14";
    const listId: string = "251eea98-9e5c-4bd3-b1ae-a863cca47c4c";

    this.props.msGraphClientFactory
      .getClient()
      .then((client: MSGraphClient): Promise<HttpClientResponse> => {
        return client
          .api(`sites/${siteId}/lists/${listId}/items`)
          .version("v1.0")
          .post(JSON.stringify({
            "fields": {
              "Title": this.state.title,
              "ArrivalDate": this.state.arrivalDate,
              "FavoriteFood": this.state.favoriteFood
            }
          }));
      })
      .then((res: any) => {
        this.setState({ result: JSON.stringify(res)});
      })
      .catch(error => {
        this.setState({ result: error.toString() });
      });
  }

  private saveUsingAadHttpClient(e: React.ChangeEvent<any>): void {
    e.preventDefault();

    const siteId: string = "officedevpnp.sharepoint.com,8a5649fd-3b86-4ed2-aa18-80382f78fb43,0e3dada5-cca3-41ef-93fb-93934d5a4f14";
    const listId: string = "251eea98-9e5c-4bd3-b1ae-a863cca47c4c";

    const opts: IHttpClientOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "fields": {
          "Title": this.state.title,
          "ArrivalDate": this.state.arrivalDate,
          "FavoriteFood": this.state.favoriteFood
        }
      })
    };

    this.props.aadHttpClientFactory
      .getClient('https://graph.microsoft.com')
      .then((client: AadHttpClient): Promise<HttpClientResponse> => {
        return client
          .post(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`,
            AadHttpClient.configurations.v1, 
            opts
          );
      })
      .then((res: HttpClientResponse) => {
        return res.json();
      })
      .then((jsonResp: any) => {
        this.setState({ result: JSON.stringify(jsonResp)});
      })
      .catch(error => {
        this.setState({ result: error.toString() });
      });
  }

  private saveUsingPnPjs(e: React.ChangeEvent<any>): void {
    e.preventDefault();

    const siteId: string = "officedevpnp.sharepoint.com,8a5649fd-3b86-4ed2-aa18-80382f78fb43,0e3dada5-cca3-41ef-93fb-93934d5a4f14";
    const listId: string = "251eea98-9e5c-4bd3-b1ae-a863cca47c4c";

    graph
    .sites.getById(siteId)
    .lists.getById(listId)
    .items.create({
      "Title": this.state.title,
      "ArrivalDate": this.state.arrivalDate,
      "FavoriteFood": this.state.favoriteFood
    } as FieldValueSet)
    .then((jsonResp: any) => {
      this.setState({ result: JSON.stringify(jsonResp.data)});
    })
    .catch(error => {
      this.setState({ result: error.toString() });
    });
  }

  private handleInputChange(event: React.ChangeEvent<any>) {
    const inputValue = event.target.value;
    const name = event.target.name;

    this.setState((state: INewPossumState): INewPossumState => {
      state[name] = inputValue;
      return state;
    });
  }
}
