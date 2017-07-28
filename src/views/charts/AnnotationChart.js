import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import FileFormat from '../../support/format'
import UsualChart from 'react-highcharts'
require('highcharts/highcharts-more')(UsualChart.Highcharts);

const AnnotationChart = observer(class AnnotationChart extends Component {
	constructor() {
		super()
		this.config = this.getDefaultConfig()
	}

	toolTipFormatter() {
		return '<b>' + this.series.name + '</b><br/>' + UsualChart.Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.point.low) +
		' - ' + UsualChart.Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.point.high) + '<br/>' + 
		"Duration: " + FileFormat.getTimeDurationStr(this.point.high - this.point.low)
	}

	getDefaultConfig() {
		const config = {
			chart: {
				type: 'columnrange',
				inverted: true,
				zoomType: 'y',
				spacing: [5,5,5,5]
			},
			title: {
				text: ''
			},
			scrollbar: {
				enabled: false
			},
			yAxis: {
				type: 'datetime',
				title: null,
				crosshair: true
			},
			plotOptions: {
				columnrange: {
					grouping: false,
					pointPadding: 0,
					stickyTracking: false
				}
			},
			legend: {
				enabled: true,
				itemWidth: 150
			},
			credits: {
				enabled: false
			},
			tooltip: {
				formatter: this.toolTipFormatter,
				followPointer: true
			}
		}
		return config
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){		
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
		}
	}

	toggleHeightMode() {
		if(this.props.graphCell.heightMode == "compact"){
			this.config.chart.height = 150
			this.config.legend.enabled = false
		}else{
			this.config.chart.height = null
			this.config.legend.enabled = true
		}
	}

	toggleDisplayMode() {
		if(this.props.graphCell.displayMode == "scroll"){
			this.config.chart.width = 20000
		}else{
			this.config.chart.width = null
		}
	}

	render() {
		this.reactToXRangeChange = mobx.reaction(() => 	this.props.graphCell.xRange, xRange => {
			console.log("react to x range change called")
			this.props.graphCell.chart.yAxis[0].setExtremes(xRange[0], xRange[1])
		})
		console.log(this.props.graphCell.isLoading)
		if(this.props.graphCell.isLoading){
			return <div id={this.props.id}>no data</div>
		}else{
			this.toggleDisplayMode()
			this.toggleHeightMode()
			this.config.series = this.props.graphCell.data
			// set extreme handler
			this.config.yAxis.events = {
				afterSetExtremes: (event) => {
					console.log("after set extremes")
					this.props.graphCell.xRange = [event.min, event.max]
					if(this.props.graphCell.xSync){
						this.props.onSyncX(this.props.id, [event.min, event.max])
					}
				}
			}
			return (
				<div>
					<UsualChart config={this.config} ref={this.props.id} domProps = {{id: this.props.id}}></UsualChart>
				</div>
			)
		}
	}
})

export default AnnotationChart;