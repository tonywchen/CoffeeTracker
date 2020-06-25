const Scraper = require('./Scraper');
const configs = require('./roasters.json');

let scraper = Scraper();
scraper.scrape(configs).then((data) => {
    console.log(data);
});