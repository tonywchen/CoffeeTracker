const PATTERN = {
    backgroundImage: /\('(?<value>.*?)'\)/,
    absolutePath: /^(http|https|http:|https:|\/\/)/
};

const Parser = (root, rules, $) => {
    const parser = {};
    const result = {};

    parser.init = () => {
        return parser;
    };

    parser._parseElem = (rule = {}) => {
        try {
            let matchList;
            if (typeof rule.match === 'string' || rule.match instanceof String) {
                matchList = [{
                    find: rule.match
                }]
            } else {
                matchList = rule.match || []
            }
            let elem = parser._parseElemMatches(root, matchList);
    
            return parser._parseValue(elem, rule.value);
        } catch (e) {
            return null;
        }
    };

    parser._parseElemMatches = (root, matchList) => {
        let elem = root;

        for (let match of matchList) {
            if (match.find) {
                elem = elem.find(match.find);
            }

            // TODO
            if (match.filter) {
                elem = elem.filter(function(i, el) {
                    if (match.filter.text) {
                        return $(this).text().includes(match.filter.text);
                    } else if (match.filter.regex) {
                        return !!new RegExp(match.filter.regex, 'i').exec($(this).text());
                    } else {
                        return false;
                    }
                });
            }

            if (match.next) {
                elem = elem.next(match.next);
            }

            if (match.nextSibling) {
                elem = $(elem[0].nextSibling);
            }
        }

        return elem;
    }

    parser._parseValue = (elem, valueRule = {}) => {
        let result = null;
        
        if (valueRule.text) {
            result = elem.contents().map(function() {
                return $(this).text();
            }).get().join(', ');
        }

        if (valueRule.textData) {
            result = elem[0].data;
        }

        if (valueRule.html) {
            result = elem.html();
        }

        if (valueRule.regex) {
            let unevaluatedValue = '';
            if (valueRule.regex.text) {
                unevaluatedValue = elem.text();
            } else if (valueRule.regex.html) {
                unevaluatedValue = elem.html();
            } else if (valueRule.regex.textData) {
                unevaluatedValue = elem[0].data;
            }

            let captured = new RegExp(valueRule.regex.expression, 'i').exec(unevaluatedValue);
            result = captured.groups[valueRule.regex.group];
        }

        if (valueRule.attr) {
            result = elem.attr(valueRule.attr);
        }

        if (valueRule.css) {
            result = elem.css(valueRule.css);

            if (valueRule.css == 'background-image') {
                result = PATTERN['backgroundImage'].exec(result).groups.value
            }
        }

        if (valueRule.hasClass) {
            result = !!elem.hasClass(valueRule.hasClass);
        }

        if (valueRule.exists) {
            result = !!elem.length;
        }

        if (typeof result === 'string') {
            result = result.trim();

            if (valueRule.params) {
                Object.keys(valueRule.params).forEach(key => {
                    result = result.replace(`{${key}}`, valueRule.params[key]);
                });
            }
        }

        return result;
    };

    parser.run = () => {
        return runner;
    };

    let runner = {
        name: (params) => {
            let name = parser._parseElem(rules.name);
            result.name = name;

            return runner;
        },
        image: (params) => {
            let image = parser._parseElem(rules.image);
            result.image = image;

            return runner;
        },
        link: (params) => {
            let link = parser._parseElem(rules.link);
            let isAbsolutePath = !!PATTERN['absolutePath'].exec(link);

            if (!isAbsolutePath) {
                let url = new URL(link, params.baseUrl);
                link = url.href;
            }

            result.link = link;

            return runner;
        },
        isOutOfStock: (params) => {
            let isOutOfStock = parser._parseElem(rules.isOutOfStock);
            result.isOutOfStock = !!isOutOfStock;

            return runner;
        },
        description: (params) => {
            let description = parser._parseElem(rules.description);
            result.description = description;

            return runner;
        },
        country: (params) => {
            let country = parser._parseElem(rules.country);
            result.country = country;

            return runner;
        },
        tastingNotes: (params) => {
            let tastingNotes = parser._parseElem(rules.tastingNotes);
            result.tastingNotes = tastingNotes;

            return runner;
        },
        varietal: (params) => {
            let varietal = parser._parseElem(rules.varietal);
            result.varietal = varietal;

            return runner;
        },
        process: (params) => {
            let process = parser._parseElem(rules.process);
            result.process = process;

            return runner;
        },
        get: () => {
            return result;
        }
    };

    return parser.init();
};

module.exports = Parser;
