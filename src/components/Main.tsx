import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import style from '../style/index';
import ComponentVideos from './Videos';

class App extends Component {
	public render() {
		const title = (
			<div
				style={{
					fontWeight: 'bold',
					fontSize: '80px',
					padding: '20px',
					color: 'white',
					display: 'flex',
					flexDirection: 'row',
					filter: 'drop-shadow(0px 0px 4px white)',
				}}>
				<div style={{opacity: 0.1}}>E</div>
				<div style={{opacity: 0.1}}>S</div>
				<div style={{opacity: 1.0}}>S</div>
				<div style={{opacity: 0.1}}>I</div>
				<div style={{opacity: 1.0}}>E</div>
				<div style={{opacity: 1.0}}>N</div>
				<div style={{opacity: 0.1}}>-</div>
				<div style={{opacity: 1.0}}>V</div>
				<div style={{opacity: 0.1}}>I</div>
				<div style={{opacity: 1.0}}>D</div>
				<div style={{opacity: 0.1}}>E</div>
				<div style={{opacity: 1.0}}>O</div>
			</div>
		);

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
					<Route exact path='/' component={ComponentVideos} />
					<Route path='/post/' component={ComponentVideos} />
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
					{title}
					<div
						style={{
							padding: '20px',
						}}
					>
						<ComponentVideos></ComponentVideos>
					</div>
					{routerExample}
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
