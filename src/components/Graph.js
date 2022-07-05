import React, { useEffect } from 'react';
import './Graph.css';
import connector from './../images/connector.gif';

const mx = require('mxgraph')({
    mxBasePath: 'mxgraph'
  })
const { mxGraph, mxConnectionHandler,mxImage,mxToolbar, mxGraphModel,mxEvent,mxClient,mxUtils,mxCell,mxGeometry, mxConstants } = mx

const Graph = props => {
    console.log('render !');
    // Program starts here. Creates a sample graph in the
    // DOM node with the specified ID. This function is invoked
    // from the onLoad event handler of the document (see below).
    const main = () =>  {
        // Checks if browser is supported
        if (!mxClient.isBrowserSupported())
        {
            // Displays an error message if the browser is
            // not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else
        {
            console.log(connector);
            // Defines an icon for creating new connections in the connection handler.
            // This will automatically disable the highlighting of the source vertex.
            mxConnectionHandler.connectImage = new mxImage(connector, 16, 16);
            
            // Creates new toolbar without event processing
            const tbContainer = document.getElementById('toolbar-container-id');
            const toolbar = new mxToolbar(tbContainer);
            toolbar.enabled = false;

            // Creates the model and the graph inside the container
            // using the fastest rendering available on the browser
            const model = new mxGraphModel();
            const graph = new mxGraph(document.getElementById('main-container-id'), model);

            // Enables new connections in the graph
            graph.setConnectable(true);
            graph.setMultigraph(false);

            // Stops editing on enter or escape keypress
            // const keyHandler = new mxKeyHandler(graph);
            // const rubberband = new mxRubberband(graph);
            const addVertex = (icon, w, h, style) => {
                // var style = graph.getStylesheet().getDefaultVertexStyle();
                style[mxConstants.STYLE_SHAPE] = mxConstants.STYLE_IMAGE;
                style[mxConstants.STYLE_IMAGE] = 'https://img.alicdn.com/tfs/TB1i4I1wxTpK1RjSZR0XXbEwXXa-80-80.svg';


                const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
                vertex.setVertex(true);
            
                const img = addToolbarItem(graph, toolbar, vertex, icon);
                img.enabled = true;
                
                graph.getSelectionModel().addListener(mxEvent.CHANGE, function()
                {
                    const tmp = graph.isSelectionEmpty();
                    mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                    img.enabled = tmp;
                });
            };
            
            addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/rectangle.gif', 100, 40,  {});
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/rounded.gif', 100, 40, 'shape=rounded');
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/triangle.gif', 40, 40, 'shape=triangle');
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
            // addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/actor.gif', 30, 40, 'shape=actor1');
        }
    };

    const addToolbarItem = (graph, toolbar, prototype, image) => {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        const funct = (graph, evt, cell, x, y) =>
        {
            graph.stopEditing(false);

            const vertex = graph.getModel().cloneCell(prototype);
            vertex.geometry.x = x;
            vertex.geometry.y = y;
                
            graph.addCell(vertex);
            graph.setSelectionCell(vertex);
        }
        
        // Creates the image which is used as the drag icon (preview)
        const img = toolbar.addMode(null, image, (evt, cell) => {
            const pt = this.graph.getPointForEvent(evt);
            funct(graph, evt, cell, pt.x, pt.y);
        });
        
        // This listener is always called first before any other listener
        // in all browsers.
        mxEvent.addListener(img, 'mousedown', function(evt)
        {
            if (img.enabled === false)
            {
                mxEvent.consume(evt);
            }
        });
                    
        mxUtils.makeDraggable(img, graph, funct);
        
        return img;
    };

    useEffect(() => {
        main();
    });
    // useState(() => {
    //     main();
    // })

    return (
        <>
        <div className='graph-container'>
            <div className="toolbar-container" id="toolbar-container-id"/>
            <div className="main-container" id="main-container-id"/>
        </div>
        </>
    );
};

export default Graph;