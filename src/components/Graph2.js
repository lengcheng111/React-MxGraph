import React, {
	useEffect, useMemo, useState
} from 'react';
import './Graph.css';
import './../lib/css/common.css';
import './../lib/css/explorer.css';
import Panel from './Panel';
import './grapheditor.css';
import SpriteSvgAwsIcons from './collection-icons/SpriteSvgAwsIcons';

const mx = require('mxgraph')({
	mxBasePath: 'mxgraph'
})
const {
	mxGraph,
	mxConnectionHandler,
	mxImage,
	mxToolbar,
	mxGraphModel,
	mxEvent,
	mxClient,
	mxUtils,
	mxCell,
	mxGeometry,
	mxConstants,
	mxParallelEdgeLayout,
	mxDragSource,
	mxLayoutManager,
	mxRubberband,
	mxKeyHandler,
	iconTolerance,
	mxRectangle,
	mxLog
} = mx;

const Graph2 = props => {

	let graph = {};
	function mxIconSet(state) {
		this.images = [];
		var graph = state.view.graph;

		// Icon1
		var img = mxUtils.createImage('images/copy.png');
		img.setAttribute('title', 'Duplicate');
		img.style.position = 'absolute';
		img.style.cursor = 'pointer';
		img.style.width = '16px';
		img.style.height = '16px';
		img.style.left = (state.x + state.width) + 'px';
		img.style.top = (state.y + state.height) + 'px';

		mxEvent.addGestureListeners(img,
			mxUtils.bind(this, function (evt) {
				var s = graph.gridSize;
				graph.setSelectionCells(graph.moveCells([state.cell], s, s, true));
				mxEvent.consume(evt);
				this.destroy();
			})
		);

		state.view.graph.container.appendChild(img);
		this.images.push(img);

		// Delete
		var img = mxUtils.createImage('images/delete2.png');
		img.setAttribute('title', 'Delete');
		img.style.position = 'absolute';
		img.style.cursor = 'pointer';
		img.style.width = '16px';
		img.style.height = '16px';
		img.style.left = (state.x + state.width) + 'px';
		img.style.top = (state.y - 16) + 'px';

		mxEvent.addGestureListeners(img,
			mxUtils.bind(this, function (evt) {
				// Disables dragging the image
				mxEvent.consume(evt);
			})
		);
		mxEvent.addListener(img, 'click',
				mxUtils.bind(this, function (evt) {
					graph.removeCells([state.cell]);
					mxEvent.consume(evt);
					this.destroy();
			})
		);

		state.view.graph.container.appendChild(img);
		this.images.push(img);
	};

	mxIconSet.prototype.destroy = function () {
		if (this.images !== null) {
			for (var i = 0; i < this.images.length; i++) {
				var img = this.images[i];
				img.parentNode.removeChild(img);
			}
		}

		this.images = null;
	};

	const createDropHandler = (cells) => {
		return function (graph, evt, target, x, y) {
		  const select = graph.importCells(cells, x, y, target);
		  graph.setSelectionCells(select);
		};
	};
	
	const createDragPreview = function (width, height) {
		var elt = document.createElement('div');
		elt.style.border = '1px dashed black';
		elt.style.width = width + 'px';
		elt.style.height = height + 'px';
		return elt;
	};
	
	const createDragSource = function (elt, dropHandler, preview) {
		return mxUtils.makeDraggable(elt, graph, dropHandler, preview, 0, 0, graph.autoscroll, true, true);
	};

	const showIconsWhenHover = (graph) => {
		graph.addMouseListener({
			currentState: null,
			currentIconSet: null,
			mouseDown: function (sender, me) {
				// Hides icons on mouse down
				if (this.currentState !== null) {
					this.dragLeave(me.getEvent(), this.currentState);
					this.currentState = null;
				}
			},
			mouseMove: function (sender, me) {
				if (this.currentState !== null && (me.getState() === this.currentState ||
						me.getState() === null)) {
					var tol = iconTolerance;
					var tmp = new mxRectangle(me.getGraphX() - tol,
						me.getGraphY() - tol, 2 * tol, 2 * tol);

					if (mxUtils.intersects(tmp, this.currentState)) {
						return;
					}
				}

				var tmp = graph.view.getState(me.getCell());

				// Ignores everything but vertices
				if (graph.isMouseDown || (tmp !== null && !graph.getModel().isVertex(tmp.cell))) {
					tmp = null;
				}

				if (tmp !== this.currentState) {
					if (this.currentState !== null) {
						this.dragLeave(me.getEvent(), this.currentState);
					}

					this.currentState = tmp;

					if (this.currentState !== null) {
						this.dragEnter(me.getEvent(), this.currentState);
					}
				}
			},
			mouseUp: function (sender, me) {},
			dragEnter: function (evt, state) {
				if (this.currentIconSet === null) {
					this.currentIconSet = new mxIconSet(state);
				}
			},
			dragLeave: function (evt, state) {
				if (this.currentIconSet !== null) {
					this.currentIconSet.destroy();
					this.currentIconSet = null;
				}
			}
		});
	};

	function addToolbarItem(graph, toolbar, prototype, image) {
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		const funct = function (graph, evt, cell) {
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

	function createPopupMenu(graph, menu, cell, evt) {
		if (cell !== null) {
			menu.addItem('Cell Item', 'images/image.gif', function () {
				mxUtils.alert('MenuItem1');
			});
		} else {
			menu.addItem('No-Cell Item', 'images/image.gif', function () {
				mxUtils.alert('MenuItem2');
			});
		}
		menu.addSeparator();
		menu.addItem('MenuItem3', 'images/warning.gif', function () {
			mxUtils.alert('MenuItem3: ' + graph.getSelectionCount() + ' selected');
		});
	};

	function handleEventDragLinkConnect() {
		graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
		{
			var edge = evt.getProperty('cell');
			var source = graph.getModel().getTerminal(edge, true);
			var target = graph.getModel().getTerminal(edge, false);

			var style = graph.getCellStyle(edge);
			var sourcePortId = style[mxConstants.STYLE_SOURCE_PORT];
			var targetPortId = style[mxConstants.STYLE_TARGET_PORT];

			mxLog.show();
			mxLog.debug('connect', edge, source.id, target.id, sourcePortId, targetPortId);
		});
	}

	function initGraph() {
		// Defines an icon for creating new connections in the connection handler.
		// This will automatically disable the highlighting of the source vertex.
		// Checks if browser is supported
		if (!mxClient.isBrowserSupported()) {
			// Displays an error message if the browser is
			// not supported.
			mxUtils.error('Browser is not supported!', 200, false);
			return {};
		} else {
			// Disables built-in context menu
			mxEvent.disableContextMenu(document.body);

			mxConnectionHandler.connectImage = new mxImage('images/connector.gif', 16, 16);

			graph = new mxGraph(document.getElementById('main-container-id'));
			// graph.htmlLabels = true;
			// graph.cellsEditable = false;
			graph.setConnectable(true);
			graph.dropEnabled = true;
		  
			// render as HTML node always. You probably won't want that in real world though
			graph.convertValueToString = function(cell) {
			  return cell.value;
			}

			graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
				console.log(menu);
				if (!cell) {
					return;
				}
				if(cell.edge || cell.vertex) { // line or node
					menu.addItem('Delete', null, function(e)
					{ 
						graph.removeCells([cell]);
						mxEvent.consume(evt);
					});
				}
			};
		  
			const createDropHandler = function (cells, allowSplit) {
			  return function (graph, evt, target, x, y) {
				const select = graph.importCells(cells, x, y, target);
				graph.setSelectionCells(select);
			  };
			};
		  
			const createDragPreview = function (width, height) {
			  var elt = document.createElement('div');
			  elt.style.border = '1px dashed black';
			  elt.style.width = width + 'px';
			  elt.style.height = height + 'px';
			  return elt;
			};
		  
			const createDragSource = function (elt, dropHandler, preview) {
			  return mxUtils.makeDraggable(elt, graph, dropHandler, preview, 0, 0, graph.autoscroll, true, true);
			};
		  
			const createItem = (id) => {
			  const item = document.querySelector(`div#${id}`);
			  if (!item) {
				return;
			  }
			  const elt = item.firstChild;
			  if (!elt) {
				return;
			  }
			  const width = elt.clientWidth;
			  const height = elt.clientHeight;
		  
			  const cell = new mxCell('', new mxGeometry(0, 0, width, height), 'fillColor=none;strokeColor=none');
			  cell.vertex = true;
			  graph.model.setValue(cell, elt);
		  
			  const cells = [cell];
		  
			  const bounds = new mxRectangle(0, 0, width, height);
			  createDragSource(elt, createDropHandler(cells, true, false, bounds), createDragPreview(width, height), cells, bounds);
			};

			handleEventDragLinkConnect();
			
			createItem("AWS--Compute--_Instance--Amazon-EC2_A1-Instance_light-bg");
			// showIconsWhenHover(graph);
			console.log('render');
		}
	}

	useEffect(() => {
		initGraph();
	});

    return (
		<div className='geEditor'>
			<SpriteSvgAwsIcons/>

			<div className='graph-container'>
				<div className="toolbar-container" id="toolbar-container-id">
					{/* FIXME: hardcode */}
					<div className="MuiListItem-root jss396 MuiListItem-gutters" tabIndex="0" id="leftbar-a1">
						<div draggable="true" id="AWS--Compute--_Instance--Amazon-EC2_A1-Instance_light-bg" className="MuiListItemIcon-root">
							<svg className="MuiSvgIcon-root jss402" focusable="false" viewBox="0 0 50 50" aria-hidden="true"><use href="#AWS--Compute--_Instance--Amazon-EC2_A1-Instance_light-bg"></use></svg>
						</div>
						<div className="MuiListItemText-root jss401"><p className="MuiTypography-root MuiListItemText-secondary MuiTypography-body2 MuiTypography-noWrap MuiTypography-displayBlock">EC2 A1 Arm</p></div>
					</div>
				</div>
				<div className="main-container" id="main-container-id">
				</div>
			</div>
        </div>
    );
};

export default Graph2;