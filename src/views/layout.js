import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Graph } from './graph.js'
import './layout.css'

const Layout = (props) => {
		return (
			<Grid>
				<Grid.Row columns={1}>
					<Grid.Column>
						
							<Graph className='graph-container' info={props.graphInfo} header={props.graphHeader} id={props.graphId} configs={props.graphConfigs} onDrop={props.onDrop} progressInfo={props.progressInfo} extremes={props.graphExtremes}></Graph>
						
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={2}>
					<Grid.Column>
					</Grid.Column>
					<Grid.Column>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
export default Layout;