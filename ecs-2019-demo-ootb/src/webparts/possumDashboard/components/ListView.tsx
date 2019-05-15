import * as React from "react";
import { IPossumListData } from "../../../data/types";

export interface IPossumDashboardListProps {
    showDetail: (id: number) => void;
    loadPossums: () => Promise<IPossumListData[]>;
}

export interface IPossumDashboardListState {
    possums: IPossumListData[];
    loaded: boolean;
}

const PossumRow = ({ possums, details }: { possums: IPossumListData[], details: (id: number) => void }) => (
    <>
        {possums.map(possum => (
            <tr><td><a href="#" onClick={(e) => { e.preventDefault(); details(possum.ID); }}>{possum.Title}</a></td><td>{possum.Status.Status}</td></tr>
        ))}
    </>
); 

export default class ListView extends React.Component<IPossumDashboardListProps, IPossumDashboardListState>{

    constructor(props: IPossumDashboardListProps) {
        super(props);

        this.state = {
            possums: [],
            loaded: false,
        };
    }

    public render(): React.ReactElement<IPossumDashboardListProps> {

        if (this.state.possums.length < 1) {

            if (this.state.loaded) {
                return (<div>No possums found 🤨</div>);
            }

            this.props.loadPossums().then(possums => {
                this.setState({
                    loaded: true,
                    possums,
                });
            });

            return (<div>Loading...</div>);
        } else {


            return (
                <div>
                    <h3>Current Possum Residents</h3>
                    <table>
                        <th>Name</th><th>Status</th>
                        <PossumRow possums={this.state.possums} details={this.props.showDetail} />
                    </table>
                </div>
            );
        }
    }
}
