import React, { useEffect } from 'react';
import './Graph.css';
import connector from './../images/connector.gif';
import EC2_DB from './../images/paste.png';

const mx = require('mxgraph')({
    mxBasePath: 'mxgraph'
  })
const { mxGraph, mxConnectionHandler,mxImage,mxToolbar, mxGraphModel,
	mxEvent,mxClient,mxUtils,mxCell,mxGeometry, mxParallelEdgeLayout,
	mxDragSource, mxLayoutManager, mxKeyHandler,mxRubberband,mxConstants,mxEdgeStyle } = mx;

const Graph2 = props => {
    function main()
		{
			// Defines an icon for creating new connections in the connection handler.
			// This will automatically disable the highlighting of the source vertex.
			mxConnectionHandler.connectImage = new mxImage('https://jgraph.github.io/mxgraph/javascript/examples/images/green-dot.gif', 16, 16);
			// Checks if browser is supported
			if (!mxClient.isBrowserSupported())
			{
				// Displays an error message if the browser is
				// not supported.
				mxUtils.error('Browser is not supported!', 200, false);
			}
			else
			{
				
				// Creates new toolbar without event processing
                const tbContainer = document.getElementById('toolbar-container-id');
                const toolbar = new mxToolbar(tbContainer);
                toolbar.enabled = false;

				// Disables built-in context menu
				mxEvent.disableContextMenu(tbContainer);
				
				// Creates the model and the graph inside the container
                // using the fastest rendering available on the browser
                const model = new mxGraphModel();
                const graph = new mxGraph(document.getElementById('main-container-id'), model);
                graph.dropEnabled = true;
				
				// Matches DnD inside the graph
				mxDragSource.getDropTarget = function(graph, x, y)
				{
					let cell = graph.getCellAt(x, y);
					
					if (!graph.isValidDropTarget(cell))
					{
						cell = null;
					}
					
					return cell;
				};
				// Enables rubberband (marquee) selection and a handler
				// for basic keystrokes (eg. return, escape during editing).
				var rubberband = new mxRubberband(graph);
				var keyHandler = new mxKeyHandler(graph);

				// Enables tooltips, new connections and panning
				graph.setPanning(true);
				graph.setTooltips(true);
				graph.setConnectable(true);

				// Automatically handle parallel edges
				var layout = new mxParallelEdgeLayout(graph);
				var layoutMgr = new mxLayoutManager(graph);
				
				layoutMgr.getLayout = function(cell)
				{
					if (cell.getChildCount() > 0)
					{
						return layout;
					}
				};
				// Changes the default style for edges "in-place" and assigns
				// an alternate edge style which is applied in mxGraph.flip
				// when the user double clicks on the adjustment control point
				// of the edge. The ElbowConnector edge style switches to TopToBottom
				// if the horizontal style is true.
				// var style = graph.getStylesheet().getDefaultEdgeStyle();
				// style[mxConstants.STYLE_ROUNDED] = true;
				// style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
		
				// graph.alternateEdgeStyle = 'elbow=vertical';

				// Installs a custom tooltip for cells
				graph.getTooltipForCell = function(cell)
				{
					return 'Doubleclick and right- or shiftclick';
				}
				
				// Installs a popupmenu handler using local function (see below).
				graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
				{
					return createPopupMenu(graph, menu, cell, evt);
				};
				
				const addVertex = function(icon, w, h, style)
				{
                    console.log(style);
					const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
					vertex.setVertex(true);
				
					addToolbarItem(graph, toolbar, vertex, icon);
				};
				const img = 'https://jgraph.github.io/mxgraph/javascript/examples/grapheditor/www/stencils/clipart/Earth_globe_128x128.png';
                console.log(`shape=image;image=${img};imageWidth=16;imageHeight=16;spacingBottom=10`);
				addVertex(img, 50, 50, `shape=image;image=${img};imageWidth=16;imageHeight=16;spacingBottom=10;`);
				toolbar.addLine();
			}
		}

		function addToolbarItem(graph, toolbar, prototype, image)
		{
			// Function that is executed when the image is dropped on
			// the graph. The cell argument points to the cell under
			// the mousepointer if there is one.
			const funct = function(graph, evt, cell)
			{
				graph.stopEditing(false);

				const pt = graph.getPointForEvent(evt);
				const vertex = graph.getModel().cloneCell(prototype);
				vertex.geometry.x = pt.x;
				vertex.geometry.y = pt.y;
				
				graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
			}

			// Creates the image which is used as the drag icon (preview)
			const img = toolbar.addMode(null, image, funct);
			mxUtils.makeDraggable(img, graph, funct);
		}

		function createPopupMenu(graph, menu, cell, evt)
		{
			if (cell != null)
			{
				menu.addItem('Cell Item', 'editors/images/image.gif', function()
				{
					mxUtils.alert('MenuItem1');
				});
			}
			else
			{
				menu.addItem('No-Cell Item', 'editors/images/image.gif', function()
				{
					mxUtils.alert('MenuItem2');
				});
			}
			menu.addSeparator();
			menu.addItem('MenuItem3', '../src/images/warning.gif', function()
			{
				mxUtils.alert('MenuItem3: '+graph.getSelectionCount()+' selected');
			});
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

export default Graph2;