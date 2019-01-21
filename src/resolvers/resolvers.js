const resolvers = {
  Mutation: {
    updateTabIndex: (_, args, { cache }) => {
      const data = {
        tabStatus: {
          tabIndex: args.tabIndex,
          __typename: "TabStatus"
        }
      };

      cache.writeData({ data });

      return data;
    }
  }
};

export default resolvers;
