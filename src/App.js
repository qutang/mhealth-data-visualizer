import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"

import {Alert, Layout, Button} from 'antd'

import ObservableUIStore from './models/UIStore'
import DevTools from 'mobx-react-devtools'
import Math from 'mathjs'
import platform from 'platform'
import GraphCellsContainer from './views/GraphCellContainer'
import FileDropZone from './views/FileDropZone'
import SiderContent from './views/SiderContent'
import FooterContent from './views/FooterContent'

class App extends Component {
	constructor() {
		super();
		this.observableUIStore = new ObservableUIStore();
	}

	addGraphCell () {
		const config = {title: "from ui store", width: 8, visible: true}
		this.observableUIStore.addGraphCell(null, config);
	}

	removeGraphCell () {
		this.observableUIStore.removeGraphCell(null);
	}

	showWarning() {
		if(platform.name !== "Chrome"){
			return <Alert style={{position:"fixed", top:0, width: "100%", zIndex: 1001}} message={<p>Please switch to <b>Chrome</b> in order to use this App, other browsers are not compatible.</p>} banner />
		}else{
			return
		}
	}

	state = {
		collapsed: false,
		icon: "left"
	}

	onCollapse () {
		let icon = this.state.collapsed ? "left" : "right";
		this.setState({collapsed: !this.state.collapsed, icon: icon})
	}

	componentDidUpdate () {
		this.observableUIStore.refreshGraphs()
	}

	render () {
		return (
			<div>
				{this.showWarning()}
			<Layout>
				<Layout.Sider 
					collapsible
					trigger={null}
					style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, backgroundColor:"white", zIndex:1000, boxShadow: "1px 0.5px 1px #ccc"}}
					collapsed={this.state.collapsed}
					width="280"
					collapsedWidth="0"
					>
					<SiderContent uistore={this.observableUIStore} />
				</Layout.Sider>
				<div style={{position: "fixed", left: 10, bottom: 10, zIndex:10001, width: "100%"}}>
					<Button shape="circle" icon={this.state.icon} type="primary" onClick={this.onCollapse.bind(this)}></Button>
				</div>
				<Layout style={{height: '100vh'}}>
					<Layout.Content >
						<GraphCellsContainer uistore={this.observableUIStore}  />
					</Layout.Content>
					<Layout.Footer style={{ textAlign: 'center',maxHeight:30, marginBottom: 20}}>
						<FooterContent />
					</Layout.Footer>
				</Layout>
			</Layout>
			</div>
		)
	}
}

export default App