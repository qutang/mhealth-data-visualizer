import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import StockChart from 'react-highcharts/ReactHighstock'

const SensorChart = observer(class SensorChart extends Component {
	constructor() {
		super()
		this.config = this.getDefaultConfig()
	}

	getDefaultConfig() {
		const config = {
			chart: {
				type: "line",
				zoomType: "x",
				animation: false,
				spacing: [5,5,5,5]
			},
			legend: {
				enabled: true
			},
			series: [],
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					animation: false,
					states: {
						hover: {
							animation: false,
							enabled: false
						}
					},
					dataGrouping: {
						smoothed: false
					}
				}
			},
			scrollbar: {
				enabled: false
			},
			navigator: {
				enabled: true
			},
			xAxis: {
			},
			yAxis: {
				opposite:false,
				alignTicks: false,
				endOnTick: false,
				startOnTick: false,
				tickInterval: 0.5
			},
			rangeSelector : {
				enabled: false
			},
		}
		return config
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
			this.refs[this.props.id].getChart().yAxis[0].setExtremes(this.props.graphCell.yRange[0], this.props.graphCell.yRange[1])
		}
		
	}

	toggleDisplayMode() {
		if(this.props.graphCell.displayMode == "scroll"){
			this.config.chart.width = 20000
			this.config.navigator.enabled = false
		}else{
			this.config.chart.width = null
			this.config.navigator.enabled = true
		}
	}	

	togglePointMode() {
		if(this.props.graphCell.pointMode == "line"){
			this.config.plotOptions.series.step = false
			this.config.plotOptions.series.dataGrouping.smoothed = false
		}else if(this.props.graphCell.pointMode == "step"){
			this.config.plotOptions.series.step = "left"
			this.config.plotOptions.series.dataGrouping.smoothed = false
		}else if(this.props.graphCell.pointMode == "spline"){
			this.config.chart.type = "spline"
			this.config.plotOptions.series.step = false
			this.config.plotOptions.series.dataGrouping.smoothed = true
		}
	}

	toggleCompactMode() {
		if(this.props.graphCell.heightMode === "compact"){
			this.config.navigator.enabled = false
			this.config.chart.height = 150
			this.config.legend.enabled = false
		}else{
			this.config.navigator.enabled = true
			this.config.chart.height = null
			this.config.legend.enabled = true
		}
	}

	render() {
		const graphCell = this.props.graphCell
		this.reactToXRangeChange = mobx.reaction(() => 	graphCell.xRange, xRange => {
			console.log("react to x range change called" + this.props.id)
			if(graphCell.chart && graphCell.chart.xAxis){
				graphCell.chart.xAxis[0].setExtremes(xRange[0], xRange[1])
				graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
				graphCell.chart.showResetZoom();
			}
		})

		this.reactToYRangeChange = mobx.reaction(() => 	graphCell.yRange, yRange => {
			console.log("react to y range change called" + this.props.id)
			if(graphCell.chart && graphCell.chart.yAxis){
				graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
			}
			if(graphCell.ySync){
				this.props.onSyncY(this.props.id, [graphCell.yRange[0], graphCell.yRange[1]])
			}
		})
		
		if(graphCell.isLoading){
			return <div id={this.props.id}>no data</div>
		}else{
			this.config.series = graphCell.data
			this.toggleDisplayMode()
			this.togglePointMode()
			this.toggleCompactMode()
			
			// set extreme handler
			this.config.xAxis = {
				events: {
					afterSetExtremes: (event) => {
						if(event.trigger){
							console.log("set x range")
							graphCell.xRange.replace([event.min, event.max])
							graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
							if(graphCell.xSync){
								this.props.onSyncX(this.props.id, [event.min, event.max])
							}
						}
					}
				}
			}
			// this.config.yAxis.min = graphCell.yRange[0]
			// this.config.yAxis.max = graphCell.yRange[1]

			this.config.yAxis.events = {
				afterSetExtremes: (event) => {
					if(event.trigger){
						console.log("set y range")
						graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
						if(graphCell.ySync){
							this.props.onSyncY(this.props.id, [graphCell.yRange[0], graphCell.yRange[1]])
						}
					}
				}
			}

			this.config.chart.events = {
				load: function() {
					if(graphCell.xRange){
						this.xAxis[0].setExtremes(graphCell.xRange[0], graphCell.xRange[1])
						this.showResetZoom()
					}

					if(graphCell.yRange){
						this.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
					}
				}
			}
			return (
					<StockChart config={this.config} ref={this.props.id} domProps = {{id: this.props.id, style: {width:"100%",margin: "0 auto"}}}></StockChart>
			)
		}
	}
})

export default SensorChart;