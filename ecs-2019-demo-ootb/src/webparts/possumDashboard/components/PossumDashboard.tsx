import * as React from 'react';
import styles from './PossumDashboard.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import ListView from "./ListView";
import DetailView from "./DetailView";

import { HttpClient } from "@microsoft/sp-http";
import { IPossumListData, IPossumDetailData } from "../../../data/types";

export interface IPossumDashboardProps {
  loadPossums: () => Promise<IPossumListData[]>;
  loadPossum: (id: number) => Promise<IPossumDetailData>;
}

export default class PossumDashboard extends React.Component<IPossumDashboardProps, { mode: "list" | "details", id: number }> {

  constructor(props: IPossumDashboardProps) {
    super(props);

    this.state = {
      mode: "list",
      id: -1,
    };
  }

  private showDetails = (id: number) => {
    this.setState({
      id,
      mode: "details",
    });
  }

  private showList = () => {
    this.setState({
      mode: "list",
    });
  }

  public render(): React.ReactElement<any> {

    if (this.state.mode === "list") {
      return <ListView showDetail={this.showDetails} loadPossums={this.props.loadPossums} />;
    }

    return <DetailView possumId={this.state.id} showList={this.showList} loadPossum={this.props.loadPossum} />;
  }
}
