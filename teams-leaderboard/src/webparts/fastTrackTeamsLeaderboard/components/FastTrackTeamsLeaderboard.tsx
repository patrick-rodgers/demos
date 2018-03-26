import * as React from "react";
import styles from "./FastTrackTeamsLeaderboard.module.scss";
import { IFastTrackTeamsLeaderboardProps } from "./IFastTrackTeamsLeaderboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { ILeaderboardData } from "model/leaderboard";

import {
  autobind,
  getRTL,
  FocusZone,
  FocusZoneDirection,
  TextField,
  Image, ImageFit,
  Icon,
  List,
  IColumn,
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  MarqueeSelection,
  DefaultButton,
} from "office-ui-fabric-react";

export interface IFastTrackTeamsLeaderboardState {
  displayItems: ILeaderboardData[];
  filterText: string;
  items: ILeaderboardData[];
  columns: IColumn[];
  selectedItem: ILeaderboardData | null;
}

export default class FastTrackTeamsLeaderboard extends React.Component<IFastTrackTeamsLeaderboardProps, IFastTrackTeamsLeaderboardState> {

  private _selection: Selection;

  private readonly _columns: IColumn[] = [
    {
      key: "rank",
      name: "Rank",
      headerClassName: styles.title,
      className: "DetailsListExample-cell--FileIcon",
      fieldName: "rank",
      minWidth: 25,
      maxWidth: 25,
      onRender: (item: ILeaderboardData) => {
        return (
          <div className={styles.leaderBoardCellRank}>
            {item.rank}
          </div>
        );
      }
    },
    {
      key: "details",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isPadded: true,
      onRender: (item: ILeaderboardData) => {
        return (
          <div className={styles.leaderBoardCellContent}>
            <div className={styles.leaderBoardCellName}>{item.firstName} {item.lastName}</div>
            <div className={styles.leaderBoardCellRank}>Rank: {item.rank}</div>
          </div>
        );
      }
    },
  ];

  constructor(props: IFastTrackTeamsLeaderboardProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: this._selectItem,
    });

    this.state = {
      displayItems: [],
      items: [],
      filterText: "",
      columns: this._columns,
      selectedItem: null,
    };

    props.items.then(items => this._sort(items)).then(items => {
      this.setState({
        displayItems: items,
        items: items
      });
    });
  }

  public get hasSelection(): boolean {
    return this._selection.count > 0;
  }

  public render(): JSX.Element {
    const { columns, items, displayItems } = this.state;
    const resultCountText: string = items.length === displayItems.length ? "" : ` (${displayItems.length} of ${items.length} shown)`;

    let listSizes: string = this.hasSelection ? "ms-Grid-col ms-sm6 ms-md4 ms-lg5" : "ms-Grid-col ms-sm12 ms-md12 ms-lg12";

    return (
      <div className={"ms-Grid " + styles.container}>
        <div className="ms-Grid-row">
          <div className={listSizes}>
            <TextField label={"Filter by name" + resultCountText} onBeforeChange={this._onFilterChanged} />
              <MarqueeSelection selection={this._selection}>
                <DetailsList
                  items={displayItems}
                  compact={false}
                  columns={columns}
                  selectionMode={SelectionMode.none}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                  selection={this._selection}
                  selectionPreservedOnEmptyClick={true}
                  enterModalSelectionOnTouch={true}
                  className={styles.list}
                />
              </MarqueeSelection>
          </div>
          {this.hasSelection &&
            <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg7" hidden={!this.hasSelection}>
              <div>
                {this.state.selectedItem.firstName} {this.state.selectedItem.lastName}
                <DefaultButton onClick={this._closeDetails}>Close</DefaultButton>
              </div>
            </div>
          }
        </div>
      </div >
    );
  }

  @autobind
  private _onFilterChanged(text: string): void {
    const { items } = this.state;

    this.setState({
      filterText: text,
      displayItems: text ? this._filter(text, items) : items
    });
  }

  private _filter(text: string, items: ILeaderboardData[]): ILeaderboardData[] {
    return items.filter(item => {
      return item.firstName.toLowerCase().indexOf(text.toLowerCase()) >= 0 ||
        item.lastName.toLowerCase().indexOf(text.toLowerCase()) >= 0;
    });
  }

  private _sort(items: ILeaderboardData[]): ILeaderboardData[] {
    return items.sort((item1, item2) => item1.rank - item2.rank);
  }

  @autobind
  private _selectItem(): void {

    const selectionCount: number = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        this.setState({
          selectedItem: null,
        });
        break;
      default:
        this.setState({
          selectedItem: this._selection.getSelection()[0] as ILeaderboardData,
        });
    }
  }

  @autobind
  private _closeDetails(): void {
    const selections: number[] = this._selection.getSelectedIndices();
    if (selections.length > 0) {
      this._selection.toggleIndexSelected(selections[0]);
    }
  }
}
