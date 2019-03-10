import {GraphQLDataSource} from 'apollo-datasource-graphql';
import {gql} from 'apollo-server-express';


// const YELP_POI_TEST = glq`{
//     business(id: "garaje-san-francisco") {
//         name
//         id
//         rating
//         url
//     }
//   }`;

const YELP_POI = gql`{
    query {
        business(id: "garaje-san-francisco") {
            name
            id
            rating
            url
        }
    }
}`;
  

export class YelpAPI extends GraphQLDataSource {
    baseURL = "https://api.yelp.com/v3/graphql";

    async getYelpPOIs() {
        try {
            const response = await this.query(YELP_POI);

            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

// function yelpRequest() {
//     var myJSONObject = `{
//       business(id: "garaje-san-francisco") {
//           name
//           id
//           rating
//           url
//       }
//     }`
    
//     request({
//       url: "https://api.yelp.com/v3/graphql",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/graphql",
//         "Authorization": "Bearer FfLMJXvs0iVD5I5K8x5BHaz7dWbv64WzwSDOw0I_HkqNlc4aTaoUvd2KyFPAMi_Mhrqi-ABmzJbXhh-Tu44eqmeAuNwEZ6uJtDf5IyEaNlQkT_-dLnu5bwZK3_aAXHYx"
//       },
//       body: myJSONObject
//     }, function (error, response, body){
//       // console.log(body);
//       return body;
//     });
//   }
module.exports = YelpAPI;
