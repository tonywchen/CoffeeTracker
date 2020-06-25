const Scraper = require('./Scraper');
const configs = require('./roasters.json');

let scraper = Scraper();
scraper.scrape(configs).then((data) => {
    console.log(data);
});

(async () => {
    let scraper = Scraper();
    let data = await scraper.scrape(configs);

    console.log(data);
})();