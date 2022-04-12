function provideClientAccessControlContext({ store }) {
  return {
    token: {
      groups: ["customers"],
    },
  };
}

export default {
  clientContextProvider: provideClientAccessControlContext,
};
