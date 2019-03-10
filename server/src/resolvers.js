module.exports = {
    Query: {
      hello: async (_, __, { dataSources }) =>
        dataSources.yelpAPI.getYelpPOIs()
    //   launch: (_, { id }, { dataSources }) =>
    //     dataSources.launchAPI.getLaunchById({ launchId: id }),
    //   me: async (_, __, { dataSources }) =>
    //     dataSources.userAPI.findOrCreateUser(),
    },
  };
  