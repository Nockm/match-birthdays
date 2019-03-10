import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import ComponentVideos from './Videos';

class App extends Component {
	public render() {
		return (
			<BrowserRouter>
				<div>
					<div>
						<Link to='/'>Home</Link>
						<Link to='/post/'>Post</Link>
					</div>
					<Switch>
						<Route exact path='/' component={ComponentVideos} />
						<Route path='/post/' component={ComponentVideos} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
