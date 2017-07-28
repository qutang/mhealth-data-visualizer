import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import {Row, Col} from 'antd'
import SensorChart from './charts/SensorChart'
import AnnotationChart from './charts/AnnotationChart'
import CategoryChart from './charts/CategoryChart'

const GraphCell = observer(class GraphCell extends Component {

	changeWidth (width) {
		this.props.graphCell.width = width;
	}

	getChart (graphKey, graphCell) {
		switch(graphCell.fileType){
			case "sensor":
				console.log("sensor chart")
				return <SensorChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX} onSyncY={this.props.onSyncY}></SensorChart>
			case "annotation":
				console.log("annotation chart")
				return <AnnotationChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX}></AnnotationChart>
			case "prediction":
			case "class":
				console.log(graphCell.fileType + " chart")
				return <CategoryChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX}></CategoryChart>
			default:
				return <SensorChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX} onSyncY={this.props.onSyncY}></SensorChart>
		}
	}

	componentDidUpdate() {
		if(this.props.graphCell.chart && this.props.graphCell.displayMode == "fit"){
			this.props.graphCell.chart.reflow();
		}
	}

	render () {
		
		const chart = <p>A chart</p>;
		const display = this.props.graphCell.visible ? "block" : "none";
		return (
			<Col span={this.props.graphCell.width} style={{display: display}}>
				<h4 style={{backgroundColor: "white", textAlign:"center"}}>{this.props.graphCell.title}</h4>
					<Row type='flex' justify='space-between'>
						<Col span={24}>
							{this.getChart(this.props.graphKey, this.props.graphCell)}
						</Col>
					</Row>
					{/*<GraphCellControl graphCell={graphCell} graphKey={graphKey} />*/}
			</Col>
		)
	}
})

export default GraphCell;