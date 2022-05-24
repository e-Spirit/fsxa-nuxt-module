import { FSXAActions } from "fsxa-pattern-library";

export const actions = {
  nuxtServerInit(_, { store }) {
    this.dispatch(FSXAActions.hydrateClient, store.state.fsxa);
  },
};
