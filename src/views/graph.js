import React from 'react'
import './graph.css'
import {List, Label, Segment, Grid, Card, Progress } from 'semantic-ui-react'
import StockChart from 'react-highcharts/ReactHighstock'
import Chart from 'react-highcharts'
import Dropzone from 'react-dropzone'
import Format from "../support/format.js"
require('highcharts-annotations')(StockChart.Highcharts);
require('highcharts-annotations')(Chart.Highcharts);


class Graph extends React.Component {

	constructor() {
		super();

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
	StockChart.Highcharts.Point.prototype.highlight = function (event) {
		this.onMouseOver(); // Show the hover marker
		// this.series.chart.tooltip.refresh(this);
		// this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};
	}

	formatFileList(files) {
		return <List horizontal><List.Item></List.Item>{files.map(file => {return (
			<List.Item>
				<List.Content>
				<Label>{Format.getSensorId(file.name) + "-" + Format.getSensorName(file.name)}<Label.Detail>{Format.getFileType(file.name)}</Label.Detail></Label>
				</List.Content>
			</List.Item>
		)})}</List>;
	}

	componentDidMount() {
	}

	handleGraphExtremeChange(event) {
		const extremes = [event.min, event.max];
		console.log(extremes)
		StockChart.Highcharts.charts.forEach((chart) => {
			if(chart && chart.renderTo.id != "chartMain"){
				chart.xAxis[0].setExtremes(extremes[0], extremes[1])
			}
		});
  	}

	handleMouseOver(e){
		StockChart.Highcharts.charts.forEach((chart) => {
			if(chart && chart.renderTo.id != this.series.chart.renderTo.id){
				const points = chart.series[0].points;
				const filtered = points.filter(point => {return point.x < this.x})
				const selected = filtered[filtered.length-1]
				// chart.xAxis[0].drawCrosshair(e, this);
				if(selected) selected.highlight(e);
				
			}
		});
	}

	handleMouseOut(e){
		StockChart.Highcharts.charts.forEach((chart) => {
			if(chart && chart.renderTo.id != this.series.chart.renderTo.id){
				const points = chart.series[0].points;
				const filtered = points.filter(point => {return point.x < this.x})
				const selected = filtered[filtered.length-1]
				if(selected) selected.onMouseOut();
				chart.tooltip.hide();
				chart.tooltip.crosshair
			}
		});
	}

	renderCharts() {

		if(this.props.configs.length == 1){
			return <StockChart config={this.props.configs[0]}></StockChart>
		}else if(this.props.configs.length > 1){
			const mainConfig = this.props.configs[0];
			mainConfig.xAxis = {
				events: {
					afterSetExtremes: this.handleGraphExtremeChange
				}
			}
			mainConfig.plotOptions.series = {
				point: {
					events: {
						mouseOver: this.handleMouseOver,
						mouseOut: this.handleMouseOut
					}
				}
			}
			console.log(mainConfig)
			const mainChart = <Grid.Column><StockChart config={mainConfig} ref='chartMain' domProps = {{id: 'chartMain'}}></StockChart></Grid.Column>
			const configs = this.props.configs.slice(1);
			console.log(configs)
			const otherCharts = configs.map((config, index) => {
				config.navigator = {
					enabled: false
				}
				config.rangeSelector = {
					enabled: false
				}
				config.scrollbar = {
					enabled: false
				}
				config.chart.height = 150
				config.plotOptions.series = {
					point: {
						events: {
							// mouseOver: this.handleMouseOver
							}
						}
				}
				return <Grid.Column><StockChart config={config} ref={'chart' + index} domProps = {{id: 'chart' + index}}></StockChart></Grid.Column>
			})
			return <Grid divided>
				<Grid.Row columns={1}>
					{mainChart}
				</Grid.Row>
				<Grid.Row columns={configs.length > 1 ? 2 : 1}>
					{otherCharts}
				</Grid.Row>
				
			</Grid>
		}else{
			return null;
		}
	}

	render() {
		
		return (
			<Card centered={true} fluid={true}>
				<Card.Content className={this.props.className}>
					<Card.Header>
						{this.renderCharts()}
					</Card.Header>
					<Progress indicating className='progress-bar' size='small' color='blue'>
						{this.props.progressInfo}
					</Progress>
				</Card.Content>
				
				<Card.Content extra className='graph-info'>
					<Grid columns={2}>
						<Grid.Column width={3}>
					<Dropzone onDrop={this.props.onDrop} className='filedrop' activeClassName='filedropActive'
					accept='.csv'>
						Drag files or clike here to load
					</Dropzone>
					</Grid.Column>
					<Grid.Column width={13}>
						{this.formatFileList(this.props.info)}
					</Grid.Column>
					</Grid>
				</Card.Content>
			</Card>
		)
		
	}
}

export { Graph };