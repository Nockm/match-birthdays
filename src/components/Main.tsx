import React, { Component } from 'react';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import style from '../style/index';
import * as db from '../logic/db';

type Props = {
}

type State = {
	data: any;
}

class App extends Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			data: null,
		}
	}

	async componentDidMount() {
		const data = await db.main();
		this.setState({ data });
	}

	public render() {
		const routerExample = (
			<div
				style={{
					padding: '20px',
					display: 'none',
				}}
			>
				<Link to='/'>Home</Link>
				<Link to='/post/'>Post</Link>
				<Switch>
				</Switch>
			</div>
		);

		return (
			<BrowserRouter>
				<div
					style={{
						background: style.background,
					}}
				>
					<div>{JSON.stringify(this.state.data, null, 4)}</div>
					<div
						style={{
							padding: '20px',
						}}
					>
					</div>
					{routerExample}
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
