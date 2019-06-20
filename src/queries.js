import gql from 'graphql-tag';


const BODY_QUERY = gql`
  {
    name
      coordinates {
        latitude
        longitude
      }
  }`
  
  const FOURSQUARE_QUERY = 
  gql` fragment FoursquarePOI on POI  {
    foursquarePOI 
      ${BODY_QUERY}
  }`

  const YELP_QUERY = 
  gql` fragment YelpPOI on POI  {
    yelpPOI 
      ${BODY_QUERY}
  }`

  const CUSTOM_QUERY = 
  gql` fragment CustomPOI on POI {
    customPOI 
      ${BODY_QUERY}
  }`

 const ALL_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $foursquareCategories: String, $yelpCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) 
    {
      ...FoursquarePOI
      ...YelpPOI
      ...CustomPOI
    }
  }${FOURSQUARE_QUERY}, ${YELP_QUERY}, ${CUSTOM_QUERY}`

 const FS_YELP_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $foursquareCategories: String, $yelpCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) 
    {
      ...FoursquarePOI
      ...YelpPOI
    }
  }${FOURSQUARE_QUERY}, ${YELP_QUERY}`

 const FS_ONLY_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $foursquareCategories: String, $yelpCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, foursquareCategories: $foursquareCategories) 
    {
      ...FoursquarePOI
    }
  }${FOURSQUARE_QUERY}`

 const YELP_ONLY_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $yelpCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, yelpCategories: $yelpCategories) 
    {
      ...YelpPOI
    }
  }${YELP_QUERY}`

 const CUSTOM_ONLY_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit) 
    {
      ...CustomPOI
    }
  }${CUSTOM_QUERY}`

 const CUSTOM_YELP_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $yelpCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, yelpCategories: $yelpCategories) 
    {
      ...CustomPOI
      ...YelpPOI
    }
  }${CUSTOM_QUERY}, ${YELP_QUERY}`

 const FS_CUSTOM_QUERY = gql` query getPOI($latitude: Float!, $longitude: Float!, $term: String, $radius: Int, $limit: Int, $foursquareCategories: String)
  {
    getPOI (term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, foursquareCategories: $foursquareCategories) 
    {
      ...FoursquarePOI
      ...CustomPOI
    }
  }${CUSTOM_QUERY}, ${FOURSQUARE_QUERY}`

export const poiQueries = {
    ALL_QUERY: ALL_QUERY,
    FS_YELP_QUERY: FS_YELP_QUERY,
    FS_ONLY_QUERY: FS_ONLY_QUERY,
    YELP_ONLY_QUERY: YELP_ONLY_QUERY,
    CUSTOM_ONLY_QUERY: CUSTOM_ONLY_QUERY,
    CUSTOM_YELP_QUERY: CUSTOM_YELP_QUERY,
    FS_CUSTOM_QUERY: FS_CUSTOM_QUERY
}

export const typeDefs = gql`

    type Query {
        poiFilter: PoiFilter
    }

    type PoiFilter {
        category: Category
        source: Source
    }

    type Source {
        yelp: Boolean,
        foursquare: Boolean,
        custom: Boolean
    }

    type Category {
        autorepair: Boolean,
        food: Boolean,
        hotels: Boolean,
        servicestations: Boolean,
        physicians: Boolean
    }

    type Mutation {
        updatePoiFilterParams(category: Category!, source: Source!): poiFilter
    }
`

export const poiFilterQuery = gql` 
query GetFilterParams {
    poiFilter @client {
        category {
            autorepair
            food
            hotels
            servicestations
            physicians
        }
        source {
            yelp
            foursquare
            custom
        }
    }
}`
