import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Radio,  Slider, InputNumber, Switch } from 'antd';

const PopoverMenu = observer(class PopoverMenu extends Component {

	showPointMode(enablePointMode) {
		var pointMode;
		if(enablePointMode){
			pointMode = <div><h4>Point mode</h4>
				<Radio.Group onChange={this.props.onPointModeChange} defaultValue="line">
					<Radio.Button value="line">Line</Radio.Button>
					<Radio.Button value="step">Step</Radio.Button>
					<Radio.Button value="spline">Spline</Radio.Button>
			</Radio.Group>
			</div>
		}else{
			<span></span>
		}
		return pointMode
	}

	render () {
		return (
			<div style={{width: this.props.menuWidth}}>
				<p style={{fontSize: 11, fontFamily: "Courier"}}>{this.props.title}</p>
				<h4>Window width</h4>
				<Slider min={8} max={24} defaultValue={this.props.defaultWindowWidthSliderValue} onAfterChange={this.props.afterWindowWidthSliderChange} step={4} dots={true} />
				
				<h4>Display mode</h4>

					{/*<Radio.Group onChange={this.props.onDisplayModeChange} defaultValue="fit">
						<Radio.Button value="fit">Fit mode</Radio.Button>
						<Radio.Button value="scroll">Scroll mode</Radio.Button>
					</Radio.Group>*/}
					<div style={{height:"5px"}}></div>
					<Radio.Group onChange={this.props.onHeightModeChange} defaultValue={this.props.defaultHeightMode}>
						<Radio.Button value="standard">Standard mode</Radio.Button>
						<Radio.Button value="compact">Compact mode</Radio.Button>
					</Radio.Group>
	
				
				{this.showPointMode(this.props.enablePointMode)}
				<h4 style={{marginTop: "5px"}}><span>Sync X axis</span> <Switch defaultChecked={this.props.defaultXsyncStatus} size="small" onChange={this.props.onSyncXChange} /></h4>
				<h4 style={{marginTop: "5px"}}><span>Sync Y axis</span> <Switch defaultChecked={this.props.defaultYsyncStatus} size="small" disabled={this.props.ySyncDisabled}/></h4>
				<h4>Y range</h4>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.defaultYRange[0]} formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.props.onMinYChange}></InputNumber><span> - </span>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.defaultYRange[1]} formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.props.onMaxYChange}></InputNumber>		
			</div>	
		)
	}
})

export default PopoverMenu;