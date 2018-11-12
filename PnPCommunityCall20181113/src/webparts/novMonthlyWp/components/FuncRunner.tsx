import * as React from "react";

export interface FuncRunnerProps<T> {
    title: string;
    action(): Promise<T>;
}

export interface FuncRunnerState<T> {
    result: T;
    isErrorResult: boolean;
}

export class FuncRunner<T = any> extends React.Component<FuncRunnerProps<T>, FuncRunnerState<T>> {

    constructor(props: FuncRunnerProps<T>, state: FuncRunnerState<T>) {
        super(props, state);

        // init state
        this.state = {
            result: null,
            isErrorResult: false,
        };
    }

    public componentDidMount(): void {
        this.props.action().then(result => this.setState({ result })).catch(e => this.setState({ result: e, isErrorResult: true }));
    }

    public render(): React.ReactElement<FuncRunnerProps<T>> {

        if (this.state.result === null) {
            return (
                <div style={{ height: 300, overflow: "auto", border: "1px, solid, #000000" }}>
                    <h2>{this.props.title}</h2>
                    <p>Loading...</p>
                </div>
            );
        }

        const color = this.state.isErrorResult ? "red" : "black";

        return (
            <div style={{ height: 300, overflow: "auto", border: "1px, solid, #000000", color }}>
                <h2>{this.props.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: JSON.stringify(this.state.result, null, 2) }}></div>
            </div>
        );
    }
}
