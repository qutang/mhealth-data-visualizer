import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import UsualChart from 'react-highcharts'
require('highcharts/highcharts-more')(UsualChart.Highcharts);

const CategoryChart = observer(class CategoryChart extends Component {
	constructor() {
		super()
		this.config = {
			chart: {
				type: 'columnrange',
				inverted: true,
				zoomType: 'y'
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
				labels: {
					enabled: true
				}
			},
			xAxis: {
				labels: {
					enabled: true	
				}
			},
			plotOptions: {
				columnrange: {
					grouping: false,
					pointPadding: 0,
					groupPadding: 0,
					stickyTracking: false
				}
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: true,
				itemWidth: 150
			},
			responsive: {
				rules: [
					{
						condition: {
							maxHeight: 100
						},
						chartOptions: {
							legend: {
								enabled: false
							},
							xAxis: {
								labels: {
									enabled: false
								}
							}
						}
					}
				]
			}
		}
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){		
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
			this.props.graphCell.chart.setSize(undefined, this.props.graphCell.height, false)
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
			if(this.props.graphCell.displayMode == "scroll"){
				this.config.chart.width = 20000
			}else if(this.props.graphCell.displayMode == "fit"){
				this.config.chart.width = null
			}
			this.config.series = this.props.graphCell.data.slice()
			const categories = this.config.series.pop()
			this.config.xAxis = {
				categories: categories
			}
			// set extreme handler
			this.config.yAxis.events = {
				afterSetExtremes: (event) => {
					if(this.props.graphCell.xRange != null){
						if(this.props.graphCell.xRange[0] == event.min && this.props.graphCell.xRange[1] == event.max){
							return
						}
					}
					this.props.graphCell.xRange = [event.min, event.max]
					if(this.props.graphCell.syncX){
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

export default CategoryChart;