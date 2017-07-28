
import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Row} from 'antd'
import GraphCell from './GraphCell'

const GraphCellsContainer = observer((props) => {
	console.log("graph cell container called")
	return (
		<Row type='flex' className='chart-container' style={{ backgroundColor:"#e9e9e9"}}>
			{props.uistore.graphCells.keys().map((graphKey, index) => {
				return (
					<GraphCell key={graphKey} graphCell={props.uistore.graphCells.get(graphKey)} graphKey={graphKey} onSyncX={props.uistore.handleSyncX.bind(this)} onSyncY={props.uistore.handleSyncY.bind(this)} />
				)
			})}
		</Row>
	)
})

export default GraphCellsContainer;