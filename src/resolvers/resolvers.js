const resolvers = {
  Mutation: {
    updateTabIndex: (_, { tabIndex }, { cache }) => {
      cache.writeData({ data: { tabIndex } });
      return null;
    }
  }
};

export default resolvers;
