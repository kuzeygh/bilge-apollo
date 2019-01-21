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
    // writeUserId: (_, args, { cache }) => {
    //   const data = {
    //     userId: {
    //       userId: args.userId,
    //       __typename: "UserId"
    //     }
    //   };

    //   cache.writeData({ data });

    //   return data;
    // }
  }
};

export default resolvers;
