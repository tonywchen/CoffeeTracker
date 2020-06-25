const axios = require('axios');
const cheerio = require('cheerio');

const configs = require('./roasters.json');

const TRANSFORM = {
    backgroundImage: /\((?<value>.*?)\)/
};

let Scraper = () => {
    const scraper = {};

    scraper.run = (configs) => {
        Object.keys(configs).forEach(key => {
            let config = configs[key];
            let canProceed = scraper.validateConfig(config);
            if (!canProceed) {
                return;
            }

            scraper.scrape(config);
        })        
    };

    scraper.scrape = async (config) => {
        for (let page of config.pages) {
            let response = await axios(page);
            let html = response.data;

            scraper.parse(html, config);
        }
    };

    scraper.parse = (html, config) => {
        const $ = cheerio.load(html);

        let baseMatch = config.rules.base;
        let products = $(baseMatch);

        let data = products.map((i, elem) => {
            elem = $(elem);

            let name = scraper.parseElem(config.rules.name, elem);
            let image = scraper.parseElem(config.rules.image, elem);
            let link = scraper.parseElem(config.rules.link, elem);
            let isOutOfStock = !!scraper.parseElem(config.rules.isOutOfStock, elem);

            return {
                roaster: config.name,
                name,
                image,
                link,
                isOutOfStock
            }
        }).get();

        console.log(data);
    };

    scraper.parseElem = (rule = {}, elem) => {
        let match = rule.match;
        let el = (match)
            ? elem.find(match)
            : elem;

        return scraper.parseValue(el, rule.value);
    };

    scraper.parseValue = (el, valueRule = {}) => {
        let result = null;
        
        if (valueRule.text) {
            result = el.text();
        }

        if (valueRule.attr) {
            result = el.attr(valueRule.attr);

            // for now, workaround for dynamic data-src
            if (valueRule.params) {
                Object.keys(valueRule.params).forEach(key => {
                    result = result.replace(`{${key}}`, valueRule.params[key]);
                });
            }
        }

        if (valueRule.css) {
            result = el.css(valueRule.css);

            if (valueRule.css == 'background-image') {
                result = TRANSFORM['backgroundImage'].exec(result).groups.value
            }
        }

        if (valueRule.hasClass) {
            result = !!el.hasClass(valueRule.hasClass);
        }

        if (valueRule.exists) {
            result = !!el.length;
        }

        return result;
    };

    scraper.validateConfig = (config) => {
        if (!config.active) {
            return false;
        }

        if (!config.rules) {
            return false;
        }

        if (Object.keys(config.rules).length === 0) {
            return false;
        }

        if (!config.pages || config.pages.length === 0) {
            return false;
        }

        return true;
    }

    return scraper;
};

let scraper = Scraper();
scraper.run(configs);

