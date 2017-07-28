import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Row, Col, Slider, Checkbox, InputNumber, Radio} from 'antd'

const AppSettingTab = observer(class AppSettingTab extends Component{

	changeWidth(newWidth) {
		this.props.uistore.defaultSettings.width = newWidth
	}

	changeXsync(checked) {
		this.props.uistore.defaultSettings.xSync = checked
	}

	changeYsync(checked) {
		this.props.uistore.defaultSettings.ySync = checked
	}

	changeHeightMode(value) {
		this.props.uistore.defaultSettings.heightMode = value
	}

	changeMinYRange(value) {
		console.log("common y range change")
		this.props.uistore.defaultSettings.yRange[0] = value
	}

	changeMaxYRange(value) {
		console.log("common y range change")
		this.props.uistore.defaultSettings.yRange[1] = value
	}

	render () {
		return <div style={{marginLeft: 10, marginRight: 10}}>
			<Row>
				<h3>Default display settings</h3>
				
				<Col>
					<b>Window width</b>
					<Slider min={8} max={24} defaultValue={this.props.uistore.defaultSettings.width} onAfterChange={this.changeWidth.bind(this)} step={4} dots={true} />
				</Col>
			</Row>
			<Row>
				<Checkbox defaultChecked={this.props.uistore.defaultSettings.xSync} onChange={this.changeXsync.bind(this)}>Sync x axis</Checkbox>
				<Checkbox defaultChecked={this.props.uistore.defaultSettings.ySync} onChange={this.changeYsync.bind(this)}>Sync y axis</Checkbox>
				<h4>Common Y range </h4>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.uistore.defaultSettings.yRange[0]}formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.changeMinYRange.bind(this)}></InputNumber><span> - </span>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.uistore.defaultSettings.yRange[1]}formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.changeMaxYRange.bind(this)}></InputNumber><span>        </span>
				<h4>Display mode: </h4>
				<Radio.Group onChange={this.changeHeightMode.bind(this)} defaultValue={this.props.uistore.defaultSettings.heightMode} size="small">
					<Radio value="standard">Standard mode</Radio>
					<Radio value="compact">Compact mode</Radio>
				</Radio.Group>
			</Row>
		</div>
	}
})

export default AppSettingTab;