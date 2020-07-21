const PATTERN = {
    backgroundImage: /\('(?<value>.*?)'\)/,
    absolutePath: /^(http|https|http:|https:|\/\/)/
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

            return runner
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
        get: () => {
            return result;
        }
    };

    return parser.init();
};

module.exports = Parser;