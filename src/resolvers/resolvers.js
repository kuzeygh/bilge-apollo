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
    },
    updateActiveList: (_, args, { cache }) => {
      const data = {
        userSettings: {
          activeList: args.activeList,
          __typename: "UserSettings"
        }
      };

      cache.writeData({ data });

      return;
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
