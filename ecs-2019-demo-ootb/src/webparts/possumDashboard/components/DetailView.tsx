import * as React from "react";
import { IPossumDetailData, IPossumStatus } from "../../../data/types";

export interface IPossumDashboardDetailProps {
    showList: () => void;
    possumId: number;
    loadPossum: (id: number) => Promise<IPossumDetailData>;
}

export interface IPossumDashboardDetailState {
    loaded: boolean;
    possum: IPossumDetailData | null;
}

const HistoryRow = ({ history }: { history: IPossumStatus[] }) => (
    <>
        {history.map(item => (
            <tr><td>{item.Status}</td><td dangerouslySetInnerHTML={{ __html: item.Details }} /><td>{item.Modified}</td></tr>
        ))}
    </>
);

export default class DetailView extends React.Component<IPossumDashboardDetailProps, IPossumDashboardDetailState>{

    constructor(props: IPossumDashboardDetailProps) {
        super(props);

        this.state = {
            loaded: false,
            possum: null,
        };
    }

    public render(): React.ReactElement<IPossumDashboardDetailProps> {

        if (this.props.possumId < 1) {
            return (<div>Error: Bad Id '{this.props.possumId}' <a href="#" onClick={(e) => { e.preventDefault(); this.props.showList(); }}>Return to list</a></div>);
        }

        if (this.state.possum === null) {

            if (this.state.loaded) {
                return (<div>Possum not found with id {this.props.possumId} 🤨</div>);
            }

            this.props.loadPossum(this.props.possumId).then(possum => {
                this.setState({
                    loaded: true,
                    possum,
                });
            });

            return (<div>Loading...</div>);
        } else {

            const { possum } = this.state;

            return (
                <div>
                    <h3>Possum Details for {possum.Title}</h3>

                    <table cellSpacing="20">
                        <tr>
                            <td>
                                <dl>
                                    <dt>Title</dt>
                                    <dd>{possum.Title}</dd>
                                    <dt>Status</dt>
                                    <dd>{possum.Status.Status}</dd>
                                    <dt>Arrival Date</dt>
                                    <dd>{(new Date(possum.ArrivalDate)).toDateString()}</dd>
                                    <dt>Favorite Food</dt>
                                    <dd>{possum.FavoriteFood}</dd>
                                </dl>
                            </td>
                            <td style={{ borderLeft: "2px solid #000000", padding: "5px", verticalAlign: "top" }}>
                                <h3>Status History</h3>
                                <table>
                                    <tr><th>Status</th><th>Details</th><th>Updated</th></tr>
                                    <HistoryRow history={possum.StatusHistory} />
                                </table>
                            </td>
                        </tr>
                    </table>

                    <p><a href="#" onClick={(e) => { e.preventDefault(); this.props.showList(); }}>Return to List</a></p>
                </div >
            );
        }
    }
}
