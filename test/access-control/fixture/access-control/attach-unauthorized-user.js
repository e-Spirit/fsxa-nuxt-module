function provideClientAccessControlContext({ store }) {
  return {
    token: null,
  };
}

export default {
  clientContextProvider: provideClientAccessControlContext,
};
