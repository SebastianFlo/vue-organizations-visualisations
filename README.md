# sebastianflo.github.io

> Visualisation of User-led organisations supporting children with disabilities in the last five years, and who funds them.

> Made for the [360 Giving Data Visualisation Challenge](https://challenge.threesixtygiving.org/)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Project Description
We have chosen the theme ‘children with disabilities or disadvantages’, because we believe in the importance of getting support early on in life in order to be able to give children the best possibilities for the future.

The word “disabilities” in this case has a broader definition - ‘A physical or mental condition that limits a person's movements, senses, or activities.’ (source: https://en.oxforddictionaries.com/definition/disability), in order to include more grants and recipients in the data-set.

It has been truly amazing to read about all the great initiatives to help children and young people with disabilities or disadvantages, as well as the many initiatives supporting and guiding their families to help create a better life for everyone.

Looking through the data, we filtered out some results that did not fit the theme, but we also kept a lot that had the overall vision to help children either with physical or mental disabilities or with disadvantages, that could impact their physical or mental well-being. We were not strict in regards to filtering, as the overall aim seemed to us to be most important – to improve the lives of all children and give them the best possible start in life.

Specifically, we are showing the grants above £1,000, given within the last five years (2014-2018) to user-led organisations that help, educate, train, or in other ways support children with disabilities or disadvantages, and their families.

### Defining user-led organisation:
We have used the data from the 360 GrantNav dataset, filtering for user-led organisations by typing ‘user-led’ in the description field. We have included all types of user-led organisations and used the broader definition of user-led organisations as organisations that are run by service users and “...where there is clear accountability to members and / or service users.” (Quote from Centres for Independent Living / Local user-led organisations: A discussion paper by Jenny Morris, page 3”). This also includes grants given to organisations that have a user-led component, e.g. community-led organisations, or support these as well as parent-led organisations, or similar representatives of support service users.

### Type of organisation:
The types of organisations are based on what is specified within the data. In the cases, where the type was not specified, we were in most cases able to find the type described on the organisation’s website. Since we are not familiar with the different types of organisations, we have not been able to be very critical about the information provided on the websites or in the data-set.
Most of the organisations are charities - almost 75%. The rest comprises of community groups, CICs, churches, schools, research institutes, a number of ‘non charitable unincorporated organisations’, and a few other types. The types are each given a color in the visualisation, to make them easy to differentiate, but as almost 75% are charities, this color becomes very dominant in the visualisation.

Data visualisation:
The idea behind the visualisation was to give a clear overview of the flow of funds from funders to recipients. The visualisation is based on a sankey diagram, which is a type of flow diagram, in which the lines are shown proportionally to the flow quantity, which in this case is the size of the grant in pounds. The lines ‘flow’ from funders in the top to the recipients at the bottom. The width of the bar for the funders/recipients indicates how much money they have awarded/received in total.

From the visualisation it is clear to see that there is two main funders, The Big Lottery Fund and The Wellcome Trust, that fund around half of the total sum given to this cause. These funders give grants to a large number of recipients as well as giving out the largest sums. From the length of the top bar, we can see that The Big Lottery Fund awards almost twice as much money as The Wellcome Trust, as the bar is almost twice as wide. By looking at the width of the lines connecting the funders and recipients, which becomes highlighted once you hover over them in order to differentiate them better, we can clearly see that The Wellcome Trust has given out the largest grant, of 4,077,276.00 £, as it has the widest line.

We wanted to make the visualisation interactive, because it makes it more fun and creates some curiosity around what you can discover by hovering over the lines and the bars. We also wanted to make it possible to make simple searches - by choosing a specific funder or recipient in the top right corner, you zoom in on that organisation and get to read about them in the left information box.

Furthermore, we wanted to give the opportunity to include or exclude certain years, to see how this changes the visualisation. This gives the possibility to visually show how there has been awarded more/larger grants some years compared to others.

The visualisation can also be accessed from a mobile device, but you will only have access to the data and not the diagram.

The visualisation is based on data extracted from GrantNav, and has been developed to communicate the specific dataset we chose, but the framework can very easily be used for different datasets, which gives a lot of possibilities to for example add more data, visualise other themes or look at how the flows changes over time by adding data from additional years.

Further analysis:
Upon reading through the data, we decided to group the grants into different overall categories, depending on what type of cause they were supporting. The categories are based on the description of each grant, and included categories like ‘Support / Guidance’, ‘Community / Social activities’, ‘Training / Exercise’, ‘Culture / Art’, etc.
This was not part of the challenge question, but arose from an interest in investigating which types of initiatives get funded and if there are some areas that are better funded than others.

Of the 245 grants we looked into, the distribution of types of initiatives funded are as follow:

| Category | Percentage of grants |
| ------------- | -----:|
| Support / Guidance | 33,9 %
| Community / Social activities | 30,6 %
| Training / Exercise | 9,8 %
| Culture / Art | 8,2%
| Health / Research | 6,1%
| Education | 5,3%
| Accessibility | 4,5%
| Safety | 1,2%
| Social Justice | 0,4%

Even though the categorization is not accurate, since it is primarily based on our assessment and each grant has only been given one category based on their main focus, whereas some would fit in several of the categories, it indicates some trends in the data. There is a lot of grants going to initiatives focused on ‘Support / Guidance’ in the form of for example support groups, counseling, etc. and ‘Community / Social activities’, for example playgroups, community centers, etc. This does not, however, indicate how much money is given to each category. This data is not included in the visualisation (it is only noted in the description of the recipients), but is an idea for a next step in the analysis that could be integrated in the visualisation in the future.

> Diagram based on http://benlogan1981.github.io/VerticalSankey/UBS.html

## Authors
Thea Hoeg ([#](http://theahoeg.com))

Sebastian Florian ([#](https://github.com/SebastianFlo/SebastianFlo.github.io))



