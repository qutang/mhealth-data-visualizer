import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Popover, Tag, Badge, Checkbox} from 'antd'
import PopoverMenu from './PopoverMenu'

const LoadedDataLabel = observer(class LoadedDataLabel extends Component {
	constructor() {
		super()
	}

	changeWidth (width) {
		this.cell.width = width;
	}

	changeDisplayMode (event) {
		this.cell.displayMode = event.target.value;
	}

	changeHeightMode (event) {
		this.cell.heightMode = event.target.value;
	}

	changePointMode (event) {
		this.cell.pointMode = event.target.value;
	}
	
	changeSyncXStatus (checked) {
		this.cell.xSync = checked
	}

	changeMinY (value) {
		let temp = this.cell.yRange.slice()
		this.cell.yRange = [value, temp[1]]
	}

	changeMaxY (value) {
		let temp = this.cell.yRange.slice()
		this.cell.yRange = [temp[0], value]
	}

	render () {
		this.cell = this.props.uistore.graphCells.get(this.props.graphKey)

		var ySyncDisabled = false;
		var enablePointMode = true;

		switch(this.cell.fileType){
			case "sensor":
				ySyncDisabled = false;
				enablePointMode = true;
				break;
			case "annotation":
			case "prediction":
			case "class":
				ySyncDisabled = true;
				enablePointMode = false;
				break;
		}

		let title = this.cell.title
		title = title.substr(0, 32)

		return <Popover placement="leftTop" 
						content={
							<PopoverMenu title={this.cell.title} afterWindowWidthSliderChange={this.changeWidth.bind(this)} defaultWindowWidthSliderValue={this.cell.width} defaultXsyncStatus={this.cell.xSync} defaultYsyncStatus={this.cell.ySync} defaultHeightMode={this.cell.heightMode}onDisplayModeChange={this.changeDisplayMode.bind(this)} 
							onHeightModeChange={this.changeHeightMode.bind(this)}
							ySyncDisabled={ySyncDisabled} enablePointMode={enablePointMode} onPointModeChange={this.changePointMode.bind(this)} menuWidth={250} onSyncXChange={this.changeSyncXStatus.bind(this)} defaultYRange={this.cell.yRange} onMinYChange={this.changeMinY.bind(this)} onMaxYChange={this.changeMaxY.bind(this)}/>
				}>
			<Tag key={this.props.graphKey} closable={true} color="blue" onClose={() => {this.props.uistore.removeGraphCell(this.props.graphKey)}}>
				<Badge status={this.cell.status} />
				<Checkbox defaultChecked={this.cell.visible} onChange={() => {this.props.uistore.toggleGraphCell(this.props.graphKey)}} style={{fontFamily: "Courier", fontSize: 10}}>{title}</Checkbox>
			</Tag>
		</Popover>
	}
})

export default LoadedDataLabel;