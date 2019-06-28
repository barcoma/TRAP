import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import mapboxgl from 'mapbox-gl'
import VueRouter from 'vue-router'
import router from './router'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { typeDefs, getLastDestination } from './shared_data/queries.js'
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist';
import gql from 'graphql-tag'; 

const httpLink = new HttpLink({
  // URL to graphql server, you should use an absolute URL here
  uri: 'http://localhost:4000/graphql'
})

const defaults = {
  lastDestination: [{
      id: 0,
      coordinates: {
        __typename: "Coordinates"
      },
      name: "Keine letzten Ziele gefunden!",
      __typename: "LastDestination"
    }
  ]
};


const cache = new InMemoryCache({
    dataIdFromObject: object => object.id
  });

const stateLink = withClientState({
  cache,
  typeDefs,
  defaults
})

persistCache({
  cache,
  storage: window.localStorage,
});


const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, httpLink]),
  resolvers: {
    Mutation: {
        updatePoiFilterParams: (_, { category, source }, {cache}) => {
            category.__typename = "category";
            source.__typename = "source";
            const data = {
                poiFilter: {
                    __typename: 'PoiFilter',
                    category: category,
                    source: source
                }
            };
            cache.writeData({ data });
            return data;
        },
        coordinateMutation: (_, {coordinates} , {cache}) => {
          var latitude = coordinates.latitude;
          var longitude = coordinates.longitude;
          const data = {
            coordinateQuery: {
              __typename: "Coordinates",
              latitude: latitude,
              longitude: longitude
            }
          };
          cache.writeData({data});
          return data;
        },
        updateLastDestination: (_, { coordinates, name }, {cache}) => {
          const query = getLastDestination;
          let previous;
          try {
            previous = cache.readQuery({ query });
          } catch (exception) {
            console.log(exception);
          }
          coordinates.__typename = "Coordinates";

          let nextDestinationId = 1;
          var newLastDestination = {
            name: name,
            coordinates: coordinates,
            __typename: "Destination"
          }
          var lastDestination;
          if (previous) {
            var lastDest = previous.lastDestination;
            if (name.includes(lastDest[lastDest.length - 1].name)) {
              lastDest.pop();
            }
            if (lastDest.length > 9) {
              lastDest.shift();
            }
            if(lastDest[lastDest.length - 1]) {
              nextDestinationId = lastDest[lastDest.length - 1].id + 1;
            }
            newLastDestination.id = nextDestinationId;
            lastDestination = lastDest.concat([newLastDestination]);
          } else {
            lastDestination = [newLastDestination];
          }
          const data = {
            lastDestination: lastDestination,
            __typename: "LastDestination"
          };
          cache.writeData({data});
          return data;
        }

      }
    }
})

Vue.use(VueApollo)
Vue.use(VueRouter)
Vue.use(Vuetify)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
