function provideClientAccessControlContext({ store }) {
  return {
    token: {
      groups: ["customers", "registered"],
    },
  };
}

export default {
  clientContextProvider: provideClientAccessControlContext,
};
