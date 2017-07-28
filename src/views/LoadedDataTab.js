import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Button, Row} from 'antd'
import LoadedDataLabel from './LoadedDataLabel'

const LoadedDataTab = observer(class LoadedDataTab extends Component{

	getClearUpButton () {
		if(this.props.uistore.graphCells.size > 0) { //if some data is loaded, show clear up button
			return <Button style={{marginLeft:2.5}} size='small' onClick={() => {this.props.uistore.graphCells.clear()}}>Clear up all loaded data</Button>
		}else{
			return <h2 style={{textAlign:"center"}}>No data is currently loaded</h2>
		}
	}

	style = {
		marginLeft: 2.5,
		marginBottom: 2.5,
		width: "95%"
	}

	render () {
	if(!this.props.uistore) return <p>No data is loaded</p>
	console.log("called loaded tab")
	return (
		<div>
		<Row>
			{this.getClearUpButton()} 
		</Row>
		<div style={this.style}></div>
		{this.props.uistore.graphCells.keys().map((graphKey, index) => {
			return (
				<div style={this.style}><LoadedDataLabel uistore={this.props.uistore} graphKey={graphKey}></LoadedDataLabel></div>
			)
		})}
		</div>
	)
	}
})

export default LoadedDataTab;