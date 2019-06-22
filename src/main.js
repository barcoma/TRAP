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
import { typeDefs } from './shared_data/queries.js'
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist';

const httpLink = new HttpLink({
  // URL to graphql server, you should use an absolute URL here
  uri: 'http://localhost:4000/graphql'
})

const cache = new InMemoryCache({
    dataIdFromObject: object => object.id
  });

const stateLink = withClientState({
  cache,
  typeDefs,
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
