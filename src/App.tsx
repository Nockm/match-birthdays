import React, { Component } from 'react';
import Main from './components/Main';
import style from './style/index';

class App extends Component {
	public render() {
		return (
			<div
				style={{
					height: '100vh',
					minHeight: '100vh',
					backgroundColor: style.background,
				}}
			>
				<Main />
			</div>
		);
	}
}

export default App;
