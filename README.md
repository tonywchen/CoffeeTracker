Demo: https://coolbeans.tonywchen.com

**TL;DR** A tracker similar to Amazon price tracker but checks for coffee bean stock status across different coffee roasters.

In the past few months where we are all practicing social distancing, I have been relying online shopping from local/Canadian coffee roasters to satisfy my coffee bean needs. With the extra time to enjoy and research coffee, I begin to feel more adventurous with trying out and new or even rare coffee beans. However, often times, coffee beans that really piqued my interest sell out before I have the chance to try.

So I thought instead of browsing the coffee catalogues every day myself, I can write a scraper that would check websites of the coffee roasters that I am interested in. The scraper can then inform me the current offerings from these coffee roasters and whether if there are new offerings or if any existing offering is sold out.

To make this happen, I imagine I would need to create following:

- Frontend UI that shows the current offerings, and shows alerts on new or sold-out beans
- Backend server that serves the data to the UI
- Database to store the offerings (possibly with a history too)
- Scraper that peridoically checks different coffee roasters' websites


Let's take a look at what is needed for each component of the project:

**Frontend UI**

At the minimum, it would be ideal to see

- a list of coffee beans from coffee roasters (predefined list in the scraper/database)
- for each coffee bean, show the name, origin/farm and maybe a picture/graphic representation of the product
- also for each coffee bean, allow linking to the respective product page
- some basic filtering/sorting/grouping functionality
- highlight new coffee beans as well as coffee beans that have sold out

It would be great to also

- for each coffee bean, get more information about their flavour profile, altitude, or other details
- show a historical availability of the beans


**Backend Server**

At the moment I don't forsee this to be a complex component other than being able to serve up the data from the database. Possibly use GraphQL just for the fun of it.

**Database**

Based on the need from the frontend UI, the database need to store the following information for each bean:

- Name of the coffee bean
- Name of the coffee roaster/brand
- Origin/Farm
- Picture/Graphical representation of the product
- URL link to the product page
- Historical Availability including:

  - Date/Time
  - Available (Yes/No/Not Sure)
  - Scraper method (Keeping a history of how this was scraped?)
  - Validity (Soft delete/whether the entry was valid)

This potentially could be a good place to store info of the roasters and the scraper method being used, instead of in the script. Might re-visit this later.

**Scraper**

The scraper will be given a list of coffee roasters, and scrape the information about the coffee beans from each roaster. For now, it should be safe to consider the name of each coffee bean as their unique identifier, and based on the identifier, determine whether this coffee bean is new/existing/sold out.

A few things to consider:

- Different webpage structure from different coffee roasters. Need a way to define the scraping rule for different roasters.
- Webpage structure from the same coffee roaster can change over time. Need a way to notify the structure change and/or create an alert about this and/or indicate whether the data is corrupt
- The coffee list could be on different pages due to bean categories or pagination
- Some roasters keep only their current offerings on the website, whereas some roasters keep all their offerings on the website but mark them as out of stock if they are sold out. Will need to account for this difference

It would also be great to enhance the scraper with the following:

- For each bean, find additional details probably only available on the individual product page





