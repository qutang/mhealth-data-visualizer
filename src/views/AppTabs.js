import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"

import {Modal, Tabs, Button} from 'antd'
import LoadedDataTab from './LoadedDataTab'
import AppSettingTab from './AppSettingTab'

const AppTabs = observer(class AppTabs extends Component{

	onClickFileFormat () {
		Modal.info({
		title: 'Accepted file formats description',
		content: (
		<iframe src="https://qutang.gitbooks.io/mhealth-specification/content/" frameborder="0" style={{width: 650, height: 400, border:"none"}}></iframe>
		),
		width: 800,
		okText:"I got it",
		onOk() {},
	});

		}

		onClickReportBug () {
		window.open("https://github.com/qutang/mhealth-data-visualizer/issues/new")
	}

	render () {
		return <Tabs size="small">
				<Tabs.TabPane tab="Loaded data" key="1">
					<LoadedDataTab uistore={this.props.uistore}></LoadedDataTab>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Settings" key="2">
					<AppSettingTab uistore={this.props.uistore}></AppSettingTab>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Help" key="3">
					<div style={{marginLeft:10, marginRight:10}}>
						<p><Button icon='file' onClick={this.onClickFileFormat}>Accepted file format</Button></p>
						<div style={{height:"5px"}}></div>
						<p><Button icon='github' onClick={this.onClickReportBug}>Report bugs or request features</Button></p>
					</div>
					
				</Tabs.TabPane>
			</Tabs>
	}
})

export default AppTabs;