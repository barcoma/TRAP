import gql from 'graphql-tag';


const BODY_QUERY = gql`
  {
    name
    id
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
        coordinateQuery: Coordinates
        lastDestination: [Destination]
    }

    type PoiFilter {
        category: Category
        source: Source
    }

    type Destination {
      id: Int
      coordinates: Coordinates
      name: String
    }

    type Source {
        yelp: Boolean,
        foursquare: Boolean,
        custom: Boolean
    }

    type Category {
        autorepair: Boolean,
        food: Boolean,
        hotelsQuery: Boolean,
        servicestations: Boolean,
        physicians: Boolean
    }

    type Coordinates {
      latitude: Float
      longitude: Float
    }

    type Mutation {
        updatePoiFilterParams(category: Category!, source: Source!): poiFilter
        coordinateMutation(coordinates: Coordinates!): coordinateQuery
        updateLastDestination(coordinates: Coordinates!, name: String!): lastDestination
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

export const updatePoiFilter = gql`
  mutation($category: Object, $source: Object) {
      updatePoiFilterParams(category: $category, source: $source) @client
  }`

export const getLastDestination = gql`
  query lastDestination {
    lastDestination @client {
      id
      name
      coordinates {
        latitude
        longitude
      }
    }
  }
`   

export const toggleNaviPoi = {
  state: {
    active_el: 1,
    active_filter: false
  },
  showPOI() {
    this.state.active_el = 2;
  },
  showNavi() {
    this.state.active_el = 1;
  },
  toggleActive(defaultValues) {
    if (defaultValues) {
      this.state.active_filter = false;
    } else {
      this.state.active_filter = true;
    }
  }
};

export const weather = {
  location: 'Wird geladen...',
  weatherIcon: '/img/icons/sunny_icon.png',
  temp: '',
  temp_max: '',
  temp_min: '',
  updateWeatherData(location, weatherIcon, temp, temp_max, temp_min) {
    this.location = location;
    this.weatherIcon = weatherIcon;
    this.temp = temp;
    this.temp_max = temp_max;
    this.temp_min = temp_min;
  }
}

export const coordinateQuery = gql` 
query coordinateQuery {
  coordinateQuery @client {
    latitude
    longitude
  }
}`

const getAmountQueryAll = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    foursquareAmount
    yelpAmount
    customAmount
  }
}`

const getAmountQueryFSYelp = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    foursquareAmount
    yelpAmount
  }
}`

const getAmountQueryFS = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    foursquareAmount
  }
}`

const getAmountQueryYelp = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    yelpAmount
  }
}`

const getAmountQueryFSCustom = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    foursquareAmount
    customAmount
  }
}`

const getAmountQueryYelpCustom = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    customAmount
    yelpAmount
  }
}`

const getAmountQueryCustom = gql` query getAmount ($latitude: Float!, $longitude: Float!, $radius: Int!, $foursquareCategories: String, $yelpCategories: String) {
  getAmount (latitude: $latitude, longitude: $longitude, radius: $radius, foursquareCategories: $foursquareCategories, yelpCategories: $yelpCategories) {
    customAmount
  }
}`


export const amountQueries = {
  ALL_QUERY: getAmountQueryAll,
  FS_YELP_QUERY: getAmountQueryFSYelp,
  FS_CUSTOM_QUERY: getAmountQueryFSCustom,
  FS_ONLY_QUERY: getAmountQueryFS,
  YELP_ONLY_QUERY: getAmountQueryYelp,
  CUSTOM_ONLY_QUERY: getAmountQueryCustom,
  CUSTOM_YELP_QUERY: getAmountQueryYelpCustom
}

export const createPOIMutation = gql`
mutation ($name: String!, $description: String, $latitude: Float!, $longitude: Float!, $tags: [String]) {
  createPOI (name: $name, description: $description, latitude: $latitude, longitude: $longitude, tags: $tags) {
    name
    description
    coordinates {
      latitude
    	longitude
    }
  }
}
`