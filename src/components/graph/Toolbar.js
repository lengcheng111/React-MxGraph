import React, {
	useEffect, useState
} from 'react';
import './Graph.css';
import './../lib/css/common.css';
import './../lib/css/explorer.css';
import './../Graph.css';

const mx = require('mxgraph')({
	mxBasePath: 'mxgraph'
})
const { mxToolbar } = mx;

const Toolbar = props => {
    const newToolbar = () => {
        // Creates new toolbar without event processing
        const tbContainer = document.getElementById('toolbar-container-id');
        const toolbar = new mxToolbar(tbContainer);
        toolbar.enabled = false;
    };

    useEffect(() => {
        newToolbar();
    })

    return (
        <div className="toolbar-container" id="toolbar-container-id"/>
    );
};

export default Toolbar;