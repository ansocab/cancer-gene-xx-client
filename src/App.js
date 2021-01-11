import React from 'react'
import { Switch, Route } from 'react-router-dom'
import EnsgSearch from './Components/EnsgSearch'
import GdcProjectChoice from './Components/GdcProjectChoice'

import Profile from './Components/Profile'
import 'bootswatch/dist/flatly/bootstrap.min.css'
import './App.css'
import ProfileManager from './Components/ProfileManager'

function App() {
	return (
		<div className='App'>
			<ProfileManager />
			<Switch>
				<Route exact path='/'>
					<EnsgSearch />
				</Route>
				<Route path='/profile'>
					<Profile />
				</Route>
				<Route path='/:ensgNumber'>
					<GdcProjectChoice />
				</Route>
			</Switch>
		</div>
	)
}

export default App
