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

        products.each((i, elem) => {
            let nameElem = $(elem).find(config.rules.name.match);
            let name = scraper.readValue(nameElem, config.rules.name.value);

            let imageElem = $(elem).find(config.rules.image.match);
            let image = scraper.readValue(imageElem, config.rules.image.value);

            let linkElem = $(elem).find(config.rules.link.match);
            let link = scraper.readValue(linkElem, config.rules.link.value);

            let isOutOfStock = false;
            if (config.rules.isOutOfStock) {
                let outOfStockElem = $(elem).find(config.rules.isOutOfStock.match);
                isOutOfStock = !!scraper.readValue(outOfStockElem, config.rules.isOutOfStock.value);
            }

            console.log(name);
            console.log(image);
            console.log(link);
            console.log(isOutOfStock);
            console.log('-----------');
        });
    };

    scraper.readValue = (elem, valueRule) => {
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

        if (valueRule.exists) {
            result = !!elem.length;
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

