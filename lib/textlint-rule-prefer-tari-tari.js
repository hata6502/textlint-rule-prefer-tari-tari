// MIT © 2017 azu
"use strict";

var _templateObject = _taggedTemplateLiteral(["", "", "", ""], ["", "", "", ""]),
    _templateObject2 = _taggedTemplateLiteral(["", "", ""], ["", "", ""]),
    _templateObject3 = _taggedTemplateLiteral(["", ""], ["", ""]);

var _nlcstParseJapanese = require("nlcst-parse-japanese");

var _nlcstPatternMatch = require("nlcst-pattern-match");

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var japaneseParser = new _nlcstParseJapanese.JapaneseParser();

var _require = require("textlint-util-to-string"),
    StringSource = _require.StringSource;

var nlcstToString = require("nlcst-to-string");
// definition
var 動詞 = {
    type: "WordNode",
    data: {
        pos: "動詞",
        pos_detail_1: ["自立", "非自立"]
    }
};
var たり = {
    type: "WordNode",
    data: {
        pos: "助詞",
        surface_form: ["だり", "たり"]
    }
};
var する = {
    type: "WordNode",
    data: {
        basic_form: "する"
    }
};
var report = function report(context) {
    var Syntax = context.Syntax,
        RuleError = context.RuleError,
        report = context.report;

    return _defineProperty({}, Syntax.Paragraph, function (node) {
        return japaneseParser.ready().then(function () {
            var matcher = new _nlcstPatternMatch.PatternMatcher({
                parser: japaneseParser
            });
            var TARI_SURU = matcher.tag(_templateObject, 動詞, たり, する);
            var TARI = matcher.tag(_templateObject2, 動詞, たり);
            var VERB = matcher.tag(_templateObject3, 動詞);
            var source = new StringSource(node);
            var text = source.toString();
            var CST = japaneseParser.parse(text);
            // Ignore empty Paragraph. Ex) '<p></p>'
            if (typeof CST.children === "undefined" || CST.children.length == 0) {
                return;
            }
            var sentences = CST.children[0].children;
            var isSameNode = function isSameNode(resultsA, resultsB) {
                return resultsA.some(function (resultA) {
                    return resultsB.some(function (resultB) {
                        return resultB.index === resultA.index;
                    });
                });
            };
            sentences.forEach(function (sentence) {
                var tariResults = matcher.matchCST(sentence, TARI);
                var tariSuruResults = matcher.matchCST(sentence, TARI_SURU);
                // `${動詞}${たり}` かつ `${動詞}${たり}${する}` の場合は除外
                if (isSameNode(tariResults, tariSuruResults)) {
                    return;
                }
                if (tariResults.length === 1) {
                    var suru = matcher.matchCST(sentence, VERB);
                    var afterSuru = suru.find(function (suru) {
                        var firstToken = tariResults[0].nodeList[0];
                        var suruFirstToken = suru.nodeList[0];
                        var prevSuruNode = sentence.children[sentence.children.indexOf(suruFirstToken) - 1];
                        // 逃げ"たり"しない のようなパターン
                        var prevIsNotTari = prevSuruNode && nlcstToString(prevSuruNode) !== "たり";
                        // 最初の"たり"より後ろ
                        return (
                            prevIsNotTari &&
                            suruFirstToken.position.start.offset > firstToken.position.start.offset &&
                            // not たり
                            (0, _nlcstPatternMatch.match)(suru.nodeList, TARI)
                        );
                    });
                    if (!afterSuru) {
                        return;
                    }
                    // report
                    // console.log(afterSuru.nodeList);
                    report(
                        node,
                        new RuleError(
                            "\u4F8B\u793A\u30FB\u4E26\u5217\u30FB\u5BFE\u8868\u73FE\u306B\u304A\u3044\u3066\u3001\u7247\u65B9\u306E\u52D5\u8A5E\u304C\u300C\u301C\u305F\u308A\u300D\u8868\u73FE\u306A\u5834\u5408\u306F\u3001\u3082\u3046\u7247\u65B9\u306E\u52D5\u8A5E\u3082\u300C\u301C\u305F\u308A\u300D\u3068\u3057\u307E\u3059\u3002",
                            {
                                index: source.originalIndexFromIndex(afterSuru.position.index)
                            }
                        )
                    );
                }
            });
        });
    });
};
module.exports = {
    linter: report,
    fixer: report
};
//# sourceMappingURL=textlint-rule-prefer-tari-tari.js.map
