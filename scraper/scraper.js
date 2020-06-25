const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('./Parser');

const Scraper = () => {
    const scraper = {};

    scraper.scrape = async (configs) => {
        let allResults = [];

        for (let key of Object.keys(configs)) {
            let config = configs[key];
            let canProceed = scraper.validateConfig(config);
            if (!canProceed) {
                continue;
            }

            let results = await scraper.scrapeOne(config);
            allResults = allResults.concat(...results);
        };
        
        return allResults;
    };

    scraper.scrapeOne = async (config) => {
        let results = [];

        for (let page of config.pages) {
            let response = await axios(page);
            let html = response.data;

            let result = scraper.parse(html, config);
            results.push(result);
        }

        return results;
    };

    scraper.validateConfig = (config) => {
        if (!config.active) {
            // return false;
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
    };

    scraper.parse = (html, config) => {
        const $ = cheerio.load(html);

        let baseMatch = config.rules.base;
        let products = $(baseMatch);

        let data = products.map((i, elem) => {
            let parser = Parser($(elem), config.rules);

            let result = parser.run()
                            .name()
                            .image()
                            .link()
                            .isOutOfStock()
                        .get();

            return {
                roaster: config.name,
                ...result
            };
        }).get();

        return data;
    };

    return scraper;
};

module.exports = Scraper;