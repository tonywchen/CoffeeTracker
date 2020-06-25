const TRANSFORM = {
    backgroundImage: /\((?<value>.*?)\)/
};

const Parser = (root, rules) => {
    const parser = {};
    const result = {};

    parser.init = () => {
        return parser;
    };

    parser._parseElem = (rule = {}) => {
        let match = rule.match;

        let elem = (match)
            ? root.find(match)
            : root;

        return parser._parseValue(elem, rule.value);
    };

    parser._parseValue = (elem, valueRule = {}) => {
        let result = null;
        
        if (valueRule.text) {
            result = elem.text();
        }

        if (valueRule.attr) {
            result = elem.attr(valueRule.attr);
        }

        if (valueRule.css) {
            result = elem.css(valueRule.css);

            if (valueRule.css == 'background-image') {
                result = TRANSFORM['backgroundImage'].exec(result).groups.value
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
        name: () => {
            let name = parser._parseElem(rules.name);
            result.name = name;

            return runner
        },
        image: () => {
            let image = parser._parseElem(rules.image);
            result.image = image;

            return runner;
        },
        link: () => {
            let link = parser._parseElem(rules.link);
            result.link = link;

            return runner;
        },
        isOutOfStock: () => {
            let isOutOfStock = parser._parseElem(rules.isOutOfStock);
            result.isOutOfStock = !!isOutOfStock;

            return runner;
        },
        get: () => {
            return result;
        }
    };

    return parser.init();
};

module.exports = Parser;