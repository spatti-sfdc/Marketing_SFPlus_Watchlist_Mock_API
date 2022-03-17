import { ApolloServer, gql } from "apollo-server";
import {
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

import casual from "casual";

const sfidType = {
  EPISODE: "a6m8A",
  COLLECTION: "a6l8A",
  SPECIAL: "a6m8A",
  SERIES: "a6l8A",
};

const makeSFID = (sfidType) => {
  const prefix = sfidType;
  const zeros = '000000';
  const alphanums = casual.uuid.slice(0, 7).toUpperCase();
  const sfid = prefix + zeros + alphanums;
  return sfid;
};

const typeDefs = gql`
  type Query {
    watchlist: Watchlist
  }

  type Mutation {
    removeWatchlistItem(watchlistItemId: Int): Boolean
    addWatchlistItem(contentId: String, contentType: String): Int
  }

  type Watchlist {
    episodes: [Episode]
    collections: [Collection]
    specials: [Special]
    series: [Series]
  }

  type Episode {
    watchlistItemId: Int
    contentUrl: String
    publishStatus: String
    description: String
    title: String
    type: String
    season: Int
    previewImageUrl: String
    previewImageAltText: String
    previewVideoUrl: String
    id: String
    sfid: String
    seriesId: String
    seriesColor: String
    seriesTitle: String
    episodeNumber: Int
    logoUrl: String
    experienceId: String
    ibmChannelId: String
    kapostId: String
  }

  type Collection {
    watchlistItemId: Int
    cardVideoUrl: String
    cardImageUrl: String
    cardImageAltText: String
    description: String
    publishStatus: String
    title: String
    id: String
    sfid: String
    numberOfEpisodes: Int
    seriesColor: String
    experienceId: String
    playBtnUrl: String
  }

  type Series {
    watchlistItemId: Int
    publishStatus: String
    title: String
    cardVideoUrl: String
    cardImageUrl: String
    cardImageAltText: String
    description: String
    id: String
    sfid: String
    seriesColor: String
    numberOfEpisodes: Int
    logoUrl: String
    numberOfSeasons: Int
    playBtnUrl: String
  }

  type Special {
    watchlistItemId: Int
    contentUrl: String
    publishStatus: String
    title: String
    description: String
    type: String
    previewImageUrl: String
    previewImageAltText: String
    previewVideoUrl: String
    id: String
    sfid: String
    ibmChannelId: String
    kapostId: String
  }
`;

const mocks = {
    Int: () => (casual.integer(1, 1000000)),
    String: () => null,
    Collection: () => ({
      sfid: () => makeSFID(sfidType.COLLECTION),
    }),
    Series: () => ({
      sfid: () => makeSFID(sfidType.SERIES),
    }),
    Episode: () => ({
      sfid: () => makeSFID(sfidType.EPISODE),
    }),
    Query: () => ({
        watchlist: () => ({
            collections: [
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-series-card-sales.png",
                "cardImageAltText": "Sales cloud",
                "description": "Stream Sales Cloud how-to, best practices, and strategic planning content to learn how you can lead your team to accelerated growth. Get insights from industry experts and explore leading solutions.",
                "id": "Sales",
                "numberOfEpisodes": 23,
                "publishStatus": "Publish",
                "seriesColor": "#06A59A",
                "title": "Sales",
                "experienceId": "Dreamforce_2021",
                "playBtnUrl": "/plus/experience/Dreamforce_2021/series/Sales/episode/episode-s1e1"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-series-card-service.png",
                "cardImageAltText": "Salesforce service",
                "description": "Stream all the hottest Salesforce service content right here on Salesforce+. Watch episodes covering industry trends and insights, new product innovation, inspirational Trailblazer stories, and more.",
                "id": "Service",
                "numberOfEpisodes": 20,
                "publishStatus": "Publish",
                "seriesColor": "#B60554",
                "title": "Service",
                "experienceId": "Dreamforce_2021",
                "playBtnUrl": "/plus/experience/Dreamforce_2021/series/Service/episode/episode-s1e1"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-series-card-marketing.png",
                "cardImageAltText": "Marketers background image",
                "description": "Stream top Salesforce marketing content right here on Salesforce+. Watch episodes from Connections and Dreamforce created to empower #MomentMarketers like you, worldwide.",
                "id": "Marketers",
                "numberOfEpisodes": 20,
                "publishStatus": "Publish",
                "seriesColor": "#DD7A01",
                "title": "Marketers",
                "experienceId": "Dreamforce_2021",
                "playBtnUrl": "/plus/experience/Dreamforce_2021/series/Marketers/episode/episode-s1e1"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-series-card-commerce.png",
                "cardImageAltText": null,
                "description": "Stream the latest Salesforce commerce content here on Salesforce+. Watch videos from Connections and Dreamforce, learn from fellow Trailblazers, and get tips to grow your business.",
                "id": "Commerce",
                "numberOfEpisodes": 19,
                "publishStatus": "Publish",
                "seriesColor": "#2E844A",
                "title": "Commerce",
                "experienceId": "Dreamforce_2021",
                "playBtnUrl": "/plus/experience/Dreamforce_2021/series/Commerce/episode/episode-s1e1"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/FrontiersSeriesCard-SlackForIT-2x.png",
                "cardImageAltText": "Under an icon of a smiley face with stars for eyes, a box of interconnected wires",
                "description": "Explore the worlds of automated workflows and secure, hybrid work for the enterprise.",
                "id": "Slack_for_IT",
                "numberOfEpisodes": 3,
                "publishStatus": "Publish",
                "seriesColor": "#36C5F0",
                "title": "Slack for IT",
                "experienceId": "Slack_Frontiers_2021",
                "playBtnUrl": "/plus/experience/Slack_Frontiers_2021/series/Slack_for_IT/episode/episode-s1e1"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/FrontiersSeriesCard-SlackForEngineers-2x.png",
                "cardImageAltText": "Under a thumbs-up icon, a worker's gloved hand adjusts dials on a machine",
                "description": "Discover the possibilities of building apps on Slack and transform your DevOps.",
                "id": "Slack_for_Engineering_and_Developers",
                "numberOfEpisodes": 5,
                "publishStatus": "Publish",
                "seriesColor": "#E01E5A",
                "title": "Slack for Engineering and Developers",
                "experienceId": "Slack_Frontiers_2021",
                "playBtnUrl": "/plus/experience/Slack_Frontiers_2021/series/Slack_for_Engineering_and_Developers/episode/episode-s1e1"
              },
            ],
            series: [
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/12/sf-plus-series-card-cro.png",
                "cardImageAltText": "Modern business leader",
                "description": "Leaders in business, culture, and sports break tradition to find growth in unexpected places.",
                "id": "Think_Outside_the_Quota",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/12/TOTQ-logo-1.png",
                "numberOfEpisodes": 3,
                "numberOfSeasons": 2,
                "publishStatus": "Publish",
                "seriesColor": "#056764",
                "title": "Think Outside the Quota",
                "playBtnUrl": "/plus/series/Think_Outside_the_Quota/episode/episode-s1e0"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-series-card-cnx.png",
                "cardImageAltText": "2 Marketers",
                "description": "Hear from innovative marketers on how they are connecting with their audiences in a whole new way.",
                "id": "Connections",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-cnx-sf-logo-440x144-1.png",
                "numberOfEpisodes": 15,
                "numberOfSeasons": 1,
                "publishStatus": "Publish",
                "seriesColor": "#2E844A",
                "title": "Connections",
                "playBtnUrl": "/plus/series/Connections/episode/episode-s1e0"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-series-card-tip.png",
                "cardImageAltText": "Top CEOs",
                "description": "The world’s top CEOs share how their backstories, influences, and values inform their leadership.",
                "id": "Inflection_Point",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-tip-logo-440x144-1.png",
                "numberOfEpisodes": 15,
                "numberOfSeasons": 3,
                "publishStatus": "Publish",
                "seriesColor": "#032D60",
                "title": "Inflection Point",
                "playBtnUrl": "/plus/series/Inflection_Point/episode/episode-s1e0"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-series-card-sbr.png",
                "cardImageAltText": "Inspirational Small Business Owners",
                "description": "An original series by Deluxe capturing the transformation of inspiring small businesses in America.",
                "id": "Small_Business_Revolution",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-home-series-sbr-logo-440x144-1.png",
                "numberOfEpisodes": 13,
                "numberOfSeasons": 4,
                "publishStatus": "Publish",
                "seriesColor": "#1B96FF",
                "title": "Small Business Revolution",
                "playBtnUrl": "/plus/series/Small_Business_Revolution/episode/episode-s1e0"
              },
              {
                "cardVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "cardImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-series-card-ltc.png",
                "cardImageAltText": "Healthy Business Leaders",
                "description": "An award-winning series focusing on how business leaders are navigating the COVID-19 pandemic.",
                "id": "Leading_Through_Change",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-ltc-logo-268x144-1.png",
                "numberOfEpisodes": 58,
                "numberOfSeasons": 6,
                "publishStatus": "Publish",
                "seriesColor": "#0B827C",
                "title": "Leading Through Change",
                "playBtnUrl": "/plus/series/Leading_Through_Change/episode/episode-s1e0"
              },
            ],
            specials: [
              {
                "contentUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "description": "Description",
                "id": "episode-s54e17Special_Live",
                "kapostId": "122221",
                "previewImageUrl": "https://wp-develop.salesforce.com/bxp/wp-content/uploads/sites/15/2021/07/Primetime@2x.png",
                "previewImageAltText": "Prime Time",
                "previewVideoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/11/sf-plus-cro-loop.mp4",
                "publishStatus": "Publish",
                "sfid": "a6m8A000000QoYnQAK",
                "title": "Special_Live",
                "type": "VOD",
                "ibmChannelId": "1",
              },
            ],
            episodes: [
            {
                "description": "Meet Carla Piñeyro Sublett, CMO at IBM, where she hopes to modernize the company by bringing its extraordinary story to life — and win an Oscar along the way.",
                "title": "How IBM Hopes to Win an Oscar by Modernizing Its Marketing",
                "episodeNumber": 3,
                "season": 1,
                "seriesTitle": "Connections",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-cnxsf-how-ibm-hopes-to-win-an-oscar-by-modernizing-its-marketing-thumb.png",
                "previewImageAltText": "Two white women in a park. One is wearing a navy sweatshirt and blue hat. One is wearing a grey tank top and black hat.",
                "id": "episode-3",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/7LBFgTF5Hr1kj1z4nsP12Q?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Connections",
                "seriesColor": "#2E844A",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-cnx-sf-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60bea206e2b9be010008da05",
                "experienceId": null
              },
              {
                "description": "Hear from CNBC's Jim Cramer on his journey from living out of his car to finding his home on-camera, educating the masses on investing.",
                "title": "Talking Money and Murder with Jim Cramer",
                "episodeNumber": 17,
                "season": 1,
                "seriesTitle": "Inflection Point",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-tip-talking-money-and-murder-with-jim-cramer-thumb.png",
                "previewImageAltText": "White man smiling with shaved head wearing a light blue collared shirt and red tie.",
                "id": "episode-17",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/aBYo9rKvPKbPvrjFhqFawA?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Inflection_Point",
                "seriesColor": "#032D60",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-tip-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "607878c2e9d7d60143dcfc11",
                "experienceId": null
              },
              {
                "description": "Many communities have seen a disturbing wave of anti-Asian violence targeting older Asian and Pacific Islanders. Join us for a special conversation with Neeracha Taychakhoonavudh and Gary Locke.",
                "title": "Taking Action to Address Anti-Asian Racism and Violence",
                "episodeNumber": 48,
                "season": 5,
                "seriesTitle": "Leading Through Change",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-ltc-taking-action-to-address-anti-asian-racism-and-violence-thumb.png",
                "previewImageAltText": "Left, olive-skinned man with grey hair and glasses. Right, olive-skinned woman with brown hair. Both in business attire.",
                "id": "episode-48",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/S5p8bvzQXbmHfa2dau9wqf?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Leading_Through_Change",
                "seriesColor": "#0B827C",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-ltc-logo-268x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60f317337d2b170103bbfa86",
                "experienceId": null
              },
              {
                "description": "Inspired by his mother's kindness, GoFundMe CMO Musa Tariq creates a safe space for users to be vulnerable. Hear how he merges his career and his values — and uses the power of marketing for good.",
                "title": "GoFundMe Is A Safe Place to Ask for Help",
                "episodeNumber": 5,
                "season": 1,
                "seriesTitle": "Connections",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-cnxsf-gofundme-is-a-safe-place-to-ask-for-help-thumb.png",
                "previewImageAltText": "Indian man with dark hair wearing jeans and varsity jacket. White woman with dark hair wearing white shirt and black pants.",
                "id": "episode-5",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/QsVZiCNrCD96qpdg1mGZR5?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Connections",
                "seriesColor": "#2E844A",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-cnx-sf-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60bea5976e24ad0150fdb85a",
                "experienceId": null
              },
              {
                "description": "How do you embrace authenticity in your career? Ebony invites Mona Kattan of Huda Beauty and Kayali Fragrances to discuss how authenticity is key to both your personal and professional life.",
                "title": "Authenticity with Mona Kattan, Huda Beauty",
                "episodeNumber": 2,
                "season": 1,
                "seriesTitle": "Boss Talks",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-bt-authenticity-with-mona-kattan-thumb.png",
                "previewImageAltText": "Smiling light-skinned woman with pink blouse and hand running through dark hair.",
                "id": "episode-2",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/e4erh1Zz3oxkk27NtWwL6R?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Boss_Talks",
                "seriesColor": "#5A1BA9",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-bt-logo-227x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60beb4e5de0bee012bfae7a7",
                "experienceId": null
              },
              {
                "description": "Gavin Patterson and Mike Sievert talk about how T-Mobile defied industry norms by rebranding itself as “the Un-carrier” while staying focused on delivering the best-in-class customer experience.",
                "title": "How T-Mobile Rebranded Itself as “the Un-carrier” -- and Succeeded Spectacularly",
                "episodeNumber": 51,
                "season": 10,
                "seriesTitle": "Leading Through Change",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-ltc-how-t-mobile-rebranded-itself-as-the-un-carrier-and-succeeded-spectacularly-thumb.png",
                "previewImageAltText": "Left, white man with long, wavy, shoulder-length hair. Right, white man with short brown hair, beard, and glasses.",
                "id": "episode-51",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/sk5eK2UfKWYQ22hvkkWnyT?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Leading_Through_Change",
                "seriesColor": "#0B827C",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-ltc-logo-268x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60a6764f4b8f8d014a398544",
                "experienceId": null
              },
              {
                "description": "Hear from Swarthmore College President Dr. Valerie Smith as she talks about the importance of diversity, educating generations to come, and the value of working together, no matter our differences.",
                "title": "The Next Generation of Leaders with Dr. Valerie Smith",
                "episodeNumber": 22,
                "season": 1,
                "seriesTitle": "Inflection Point",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-tip-the-next-generation-of-leaders-with-dr-valerie-smith-thumb.png",
                "previewImageAltText": "Black woman smiling with dark hair and glasses wearing a black blouse and red jacket.",
                "id": "episode-22",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/7riuWPLYXQfhVXvZ9jjV7f?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Inflection_Point",
                "seriesColor": "#032D60",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-tip-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "607468d562f020016128f1ca",
                "experienceId": null
              },
              {
                "description": "Big wave surfer, inventor, author, TV host, and fitness and nutrition expert Laird Hamilton is also Co-Founder of two companies: Laird Superfood and Extreme Performance Training (XPT).",
                "title": "Surfer Laird Hamilton Makes Waves w/ Authentic Marketing",
                "episodeNumber": 4,
                "season": 1,
                "seriesTitle": "Connections",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-cnxsf-surfer-laird-hamilton-makes-waves-with-authentic-marketing-thumb.png",
                "previewImageAltText": "Man and woman in front of tropical plants. Man is blonde with blue button down. Woman has brown hair and a coral blouse.",
                "id": "episode-4",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/Z9RNXqN9Y4QmPQ8EJdoh8m?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Connections",
                "seriesColor": "#2E844A",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-cnx-sf-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60bea5106e24ad0150fdb835",
                "experienceId": null
              },
              {
                "description": "Lynne Zaledonis talks with Paula Nicola and Phil Hearn about how they reimagined their loyalty strategy and how they’re using Salesforce to engage their customers across channels and touchpoints.",
                "title": "How schuh Reimagined Their Approach to Customer Loyalty",
                "episodeNumber": 49,
                "season": 6,
                "seriesTitle": "Leading Through Change",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-ltc-how-schuh-reimagined-their-approach-to-customer-loyalty-thumb.png",
                "previewImageAltText": "Left, white woman with brown hair and glasses, smiling. Right, white man with grey hair and goatee, smiling.",
                "id": "episode-49",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/jMhzmjexZRsYzZZJBCY8eV?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Leading_Through_Change",
                "seriesColor": "#0B827C",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-ltc-logo-268x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60f317bde64c6400ed0bbf2a",
                "experienceId": null
              },
              {
                "description": "Hear from PayPal CEO Dan Schulman on living on the street to learn about homelessness, practicing Krav Maga, and democratizing financial services.",
                "title": "Social Activism at Work with Dan Schulman",
                "episodeNumber": 1,
                "season": 1,
                "seriesTitle": "Inflection Point",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-tip-social-activism-at-work-with-dan-schulman-thumb.png",
                "previewImageAltText": "White man smiling with brown hair wearing a navy sweater.",
                "id": "episode-1",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/fqKv9CdSAKVToESswchyH9?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Inflection_Point",
                "seriesColor": "#032D60",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-tip-logo-440x144-1.png",
                "ibmChannelId": null,
                "kapostId": "606c8207e931ba011c01f2b4",
                "experienceId": null
              },
              {
                "description": "Ebony and former NFL athlete, Kelvin Beachum discuss their experiences with imposter syndrome. They share their tips for transforming negative self-talk into motivational, boss-building affirmations.",
                "title": "Navigating Imposter Syndrome with Kelvin Beachum, NFL Athlete",
                "episodeNumber": 11,
                "season": 1,
                "seriesTitle": "Boss Talks",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-bt-navigating-imposter-syndrome-with-kelvin-beachum-thumb.png",
                "previewImageAltText": "Black male with buzz cut hair, white button down shirt, and teal blazer.",
                "id": "episode-11",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/pLGB3wnW6sBgVEetBuSPRo?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Boss_Talks",
                "seriesColor": "#5A1BA9",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-bt-logo-227x144-1.png",
                "ibmChannelId": null,
                "kapostId": "60beb471abab52012741828e",
                "experienceId": null
              },
              {
                "description": "We Kick off Season 1 with Ekta Chopra, Chief Digital Officer, and see how Salesforce’s Digital 360 is essential for e.l.f. Beauty and hear her tips for making the switch to a digital-first business.",
                "title": "Digital 360: A Digital-First Makeover",
                "episodeNumber": 12,
                "season": 1,
                "seriesTitle": "Simply Put",
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-sp-digital-360-a-digital-first-makeover-thumb.png",
                "previewImageAltText": "Olive-skinned woman with long brown hair and glasses sitting in a living room with a bouquet of flowers on the table.",
                "id": "episode-12",
                "publishStatus": "Publish",
                "contentUrl": "https://salesforce.vidyard.com/watch/jaC8G3fdyUZjh3d9jR7btE?",
                "type": "VOD",
                "previewVideoUrl": null,
                "seriesId": "Simply_Put",
                "seriesColor": "#2F2CB7",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-home-series-sp-logo-440x95-1.png",
                "ibmChannelId": null,
                "kapostId": "604fb56defab6c0124f3b5f4",
                "experienceId": null
              },
              {
                "contentUrl": "https://salesforce.vidyard.com/watch/wYcJ9z6RWYfki5M3zwQrPx?",
                "description": "Learn how  to personalize experiences, optimize marketing, and activate AI-based insights with Salesforce CDP and Marketing Cloud.",
                "episodeNumber": 33,
                "season": 1,
                "id": "episode-33",
                "seriesId": "Marketers",
                "experienceId": "Dreamforce_2021",
                "kapostId": null,
                "previewImageUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-xp-episode-ph-cloudy-b.png",
                "previewImageAltText": "How to Use Salesforce CDP to Build Data-Driven Experiences",
                "publishStatus": "Publish",
                "seriesTitle": "Marketers",
                "title": "How to Use Salesforce CDP to Build Data-Driven Experiences",
                "seriesColor": "#DD7A01",
                "logoUrl": "https://wp.salesforce.com/bxp/wp-content/uploads/sites/6/2021/08/sf-plus-df-roles-marketer-logo.png",
                "type": "VOD"
              }
            ],
        }),
    }),
};

const server = new ApolloServer({
  typeDefs,
  mocks,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

const PORT = process.env.PORT ?? '4002';

server.listen(PORT).then(() => {
  console.log(`🚀 ==== Server ready at ${PORT}`);
});
