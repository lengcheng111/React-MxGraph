import React, {
	useEffect
} from 'react';
import './Graph.css';
import './../lib/css/common.css';
import './../lib/css/explorer.css';

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
	mxParallelEdgeLayout,
	mxDragSource,
	mxLayoutManager,
	mxRubberband,
	mxKeyHandler,
	iconTolerance,
	mxRectangle
} = mx;

const Graph2 = props => {

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

	function main() {
		// Defines an icon for creating new connections in the connection handler.
		// This will automatically disable the highlighting of the source vertex.
		mxConnectionHandler.connectImage = new mxImage('images/connector.gif', 16, 16);
		// Checks if browser is supported
		if (!mxClient.isBrowserSupported()) {
			// Displays an error message if the browser is
			// not supported.
			mxUtils.error('Browser is not supported!', 200, false);
		} else {

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
			mxDragSource.getDropTarget = function (graph, x, y) {
				let cell = graph.getCellAt(x, y);

				if (!graph.isValidDropTarget(cell)) {
					cell = null;
				}

				return cell;
			};
			// Enables rubberband (marquee) selection and a handler
			// for basic keystrokes (eg. return, escape during editing).
			// var rubberband = new mxRubberband(graph);
			// var keyHandler = new mxKeyHandler(graph);

			// Enables tooltips, new connections and panning
			graph.setPanning(true);
			graph.setTooltips(true);
			graph.setConnectable(true);

			// Enables rubberband (marquee) selection and a handler
			// for basic keystrokes (eg. return, escape during editing).
			new mxRubberband(graph);
			new mxKeyHandler(graph);

			// Automatically handle parallel edges
			var layout = new mxParallelEdgeLayout(graph);
			var layoutMgr = new mxLayoutManager(graph);

			layoutMgr.getLayout = function (cell) {
				if (cell.getChildCount() > 0) {
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
			graph.getTooltipForCell = function (cell) {
				return 'Doubleclick and right- or shiftclick';
			}
			console.log(graph);

			// Installs a popupmenu handler using local function (see below).
			graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
				return createPopupMenu(graph, menu, cell, evt);
			};

			const addVertex = function (icon, w, h, style) {
				const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
				vertex.setVertex(true);

				addToolbarItem(graph, toolbar, vertex, icon);
			};
			const img = 'https://jgraph.github.io/mxgraph/javascript/examples/grapheditor/www/stencils/clipart/Earth_globe_128x128.png';
			addVertex(img, 50, 50, `shape=image;image=${img};imageWidth=16;imageHeight=16;spacingBottom=10;`);
			toolbar.addLine();

			// Shows icons if the mouse is over a cell
			showIconsWhenHover(graph);
		}
	}

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

	useEffect(() => {
		main();
	});

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