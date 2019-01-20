const resolvers = {
  Mutation: {
    updateTabIndex: (_, { tabIndex }, { cache }) => {
      const data = { tabStatus: { tabIndex, __typename: "TabStatus" } };
      cache.writeData({ data });
      return null;
    }
  }
};

export default resolvers;
