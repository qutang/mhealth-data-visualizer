import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import FileDropZone from './FileDropZone'
import AppTabs from './AppTabs'

const SiderContent = observer(class SiderContent extends Component{

	render () {
		return <div>
				 <FileDropZone uistore={this.props.uistore} />
				<AppTabs uistore={this.props.uistore}></AppTabs> 
			  </div>
	}
})

export default SiderContent;