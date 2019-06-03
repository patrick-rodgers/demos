import * as React from 'react';
import styles from './BalanceOverview.module.scss';
import { IBalanceOverviewProps } from './IBalanceOverviewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IBalanceOverviewState } from './IBalanceOverviewState';
import { IPossumBalance } from '../../../data/types';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { DetailsList, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';

export default class BalanceOverview extends React.Component<IBalanceOverviewProps, IBalanceOverviewState> {
  constructor(props: IBalanceOverviewProps) {
    super(props);

    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.handleBalanceInputChange = this.handleBalanceInputChange.bind(this);
    this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);

    this.state = {
      balanceData: [],
      loading: false,
      updating: false
    };
  }

  public componentDidMount() {
    this.setState({ loading: true, loadingError: undefined });
    this.props
      .getPossumBalance()
      .then((data: IPossumBalance[]): void => {
        this.setState({
          loading: false,
          balanceData: data
        });
      }, (err: any): void => {
        this.setState({
          loading: false,
          loadingError: err.toString()
        });
      });
  }

  private handleNameInputChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) {
    this.setState({ newBalancePossum: option ? option.text : undefined });
  }

  private handleBalanceInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newBalance: event.target.value });
  }

  private handleUpdateButtonClick(event?: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ updating: true, updatingError: undefined });
    this.props
      .updatePossumBalance(this.state.newBalancePossum, Number(this.state.newBalance))
      .then((data: IPossumBalance[]): void => {
        this.setState({
          updating: false,
          balanceData: data,
          newBalance: '',
          newBalancePossum: ''
        });
      }, (err: any): void => {
        this.setState({ updating: false, updatingError: err.toString() });
      });
  }

  private canSubmitNewBalance(): boolean {
    return typeof this.state.newBalance !== 'undefined' &&
      typeof this.state.newBalancePossum !== 'undefined' &&
      this.state.newBalancePossum.trim().length > 0 &&
      this.state.newBalance.trim().length > 0 &&
      !isNaN(Number(this.state.newBalance));
  }

  public render(): React.ReactElement<IBalanceOverviewProps> {
    return (
      <div className={styles.balanceOverview}>
        {this.state.loading &&
          <Stack horizontal={true} verticalAlign='center' horizontalAlign='center' gap={20}>
            <Label>Loading data...</Label><Spinner size={SpinnerSize.small} />
          </Stack>}
        {this.state.loadingError &&
          <Stack horizontal={true} horizontalAlign='center'>
            The following error has occurred while loading data: <span>{this.state.loadingError}</span>
          </Stack>}
        {!this.state.loading &&
          this.state.balanceData.length > 0 &&
          <Stack horizontal={false} gap={20}>
            <DetailsList
              items={this.state.balanceData}
              columns={[
                { key: 'name', name: 'Possum', fieldName: 'name', minWidth: 100 },
                { key: 'balance', name: 'Balance', fieldName: 'balance', minWidth: 100, className: styles.balance }
              ]}
              selectionMode={SelectionMode.none}
            />
            <fieldset disabled={this.state.updating}>
              <legend>Update balance:</legend>
              <Stack horizontal={true} gap={20} verticalAlign='end'>
                <Stack.Item align='stretch' grow>
                  <Dropdown
                    placeHolder='Select a possum'
                    label='Possum'
                    options={this.state.balanceData.map(b => { return { key: b.name, text: b.name }; })}
                    selectedKey={this.state.newBalancePossum}
                    onChange={this.handleNameInputChange} />
                </Stack.Item>
                <Stack.Item align='stretch' grow>
                  <TextField label='New balance' prefix='$' value={this.state.newBalance} onChange={this.handleBalanceInputChange} />
                </Stack.Item>
                <Stack.Item align='end'>
                  <Button primary={true} onClick={this.handleUpdateButtonClick} disabled={!this.canSubmitNewBalance()}>Update</Button>
                </Stack.Item>
              </Stack>
              {this.state.updatingError &&
                <Stack horizontal={true} horizontalAlign='center'>
                  The following error has occurred while updating balance: <span>{this.state.updatingError}</span>
                </Stack>}
            </fieldset>
            {this.state.updating &&
              <Stack horizontal={true} verticalAlign='center' horizontalAlign='center' gap={20}>
                <Label>Updating balance...</Label><Spinner size={SpinnerSize.small} />
              </Stack>}
          </Stack>}
        {!this.state.loading &&
          !this.state.loadingError &&
          this.state.balanceData.length === 0 &&
          <Stack horizontalAlign='center'>No balance data found</Stack>}
      </div>
    );
  }
}
