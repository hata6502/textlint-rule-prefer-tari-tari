// MIT © 2017 azu
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = require("textlint-rule-helper"),
    IgnoreNodeManager = _require.IgnoreNodeManager;

var _require2 = require("textlint-util-to-string"),
    StringSource = _require2.StringSource;

var paragraphReporter = (exports.paragraphReporter = function paragraphReporter(_ref) {
    var node = _ref.node,
        ignoreNodeTypes = _ref.ignoreNodeTypes,
        context = _ref.context;

    var originalText = context.getSource(node);
    var source = new StringSource(node);
    var text = source.toString();
    var ignoreNodeManager = new IgnoreNodeManager();
    // Ignore following pattern
    // Paragraph > Link Code Html ...
    ignoreNodeManager.ignoreChildrenByTypes(node, ignoreNodeTypes);
    var index = source.originalIndexFromIndex(result.index);
    var endIndex = source.originalIndexFromIndex(result.index + result.match.length);
    var range = [index, endIndex];
    // if the error is ignored, don't report
    if (ignoreNodeManager.isIgnoredRange(range)) {
        return;
    }
});
//# sourceMappingURL=util.js.map
