<script>
import HelloWorld from './components/HelloWorld.vue'
import HeaderView from './views/HeaderView.vue'

export default {
  components: {
    HelloWorld,
    HeaderView
  }
}
</script>

<template>
  <v-app>
    <header-view />

    <!-- Sizes your content based upon application components -->
    <v-main
      class="container-fluid-max"
      style="background: var(--v-bkgroundLightGrey-base)"
    >
      <!-- Provides the application the proper gutter -->
      <v-container
        fluid
        class="ma-0 pa-0"
      >
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.v-main__wrap {
  margin: 8px;
  padding: 12px 16px;
  border: 1px solid #c4c4c4;
  border-radius: 7px;
}
</style>
