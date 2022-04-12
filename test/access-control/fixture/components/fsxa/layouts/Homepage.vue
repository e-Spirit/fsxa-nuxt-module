<template>
  <div>
    <p>currentNavigationNode:{{ this.currentPage.id }}</p>
    <p>pageData:{{ this.data }}</p>
    <p>navigationData:{{ this.navigationData }}</p>
  </div>
</template>

<script>
import { FSXABaseLayout } from "fsxa-pattern-library";

export default {
  extends: FSXABaseLayout,
};
</script>
