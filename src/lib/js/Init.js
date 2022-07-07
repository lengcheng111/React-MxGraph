// urlParams is null when used for embedding
const urlParams = window.urlParams || {};

// Public global variables
const MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE  || 10485760;
const MAX_AREA = window.MAX_AREA || 15000 * 15000;
const EXPORT_URL = window.EXPORT_URL || '/export';
const SAVE_URL = window.SAVE_URL || '/save';
const OPEN_URL = window.OPEN_URL || '/open';
const RESOURCES_PATH = window.RESOURCES_PATH || 'resources';
const RESOURCE_BASE = window.RESOURCE_BASE || window.RESOURCES_PATH + '/grapheditor';
const STENCIL_PATH = window.STENCIL_PATH || 'stencils';
const IMAGE_PATH = window.IMAGE_PATH || 'images';
const STYLE_PATH = window.STYLE_PATH || 'styles';
const CSS_PATH = window.CSS_PATH || 'styles';
const OPEN_FORM = window.OPEN_FORM || 'open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
const mxBasePath = window.mxBasePath || '../../../src';
const mxLanguage = window.mxLanguage || urlParams['lang'];
const mxLanguages = window.mxLanguages || ['de', 'se'];
