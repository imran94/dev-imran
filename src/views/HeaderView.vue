<template>
  <v-navigation-drawer
    app
    permanent
    :mini-variant="isMenuCollapsed"
    mini-variant-width="76"
    max-width="181"
  >
    <v-list-item class="logo-container">
      <img
        class="logo"
        src="@/assets/tabnext-logo.png"
      />
    </v-list-item>

    <v-list
      dense
      nav
      class="menu-list"
      :style="{ width: isMenuCollapsed ? '85%' : '95%' }"
    >
      <v-list-item
        link
        @click="toggleMenu"
        class="outlined-link align-center justify-center"
        :class="{ 'filled-link': isMenuCollapsed }"
      >
        <v-list-item-icon>
          <v-icon :dark="isMenuCollapsed">mdi-cloud-upload</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Collapse Menu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        style="border-radius: 32px !important"
      >
        <v-list-item-icon>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Waiting List</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list
      dense
      rounded
      nav
      class="menu-list menu-list-bottom"
      :style="{ width: isMenuCollapsed ? '85%' : '95%' }"
    >
      <v-list-item
        link
        class="messages-link"
      >
        <v-list-item-icon>
          <v-avatar
            color="#EC6161"
            size="20"
            style="align-self: center"
            ><span class="white--text">2</span></v-avatar
          >
        </v-list-item-icon>

        <v-list-item-content> Messages </v-list-item-content>
      </v-list-item>

      <v-list-item
        link
        two-line
      >
        <v-list-item-icon style="align-self: center">
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>User</v-list-item-title>

          <v-list-item-subtitle>Profile Setting</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    isMenuCollapsed: false
  }),
  methods: {
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed
    }
  }
}
</script>

<style scoped>
.nav-drawer {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.logo {
  max-width: 65%;
  margin: auto;
}
.logo-container {
  justify-self: center;
  box-sizing: border-box;
}

.menu-list {
  margin: 16px 12px 8px;
}

.menu-list-bottom {
  position: fixed;
  bottom: 12px;
}

.list-item {
}

.mini-icon {
  box-sizing: border-box;
  margin: 8px;
}

.outlined-link {
  border: 1.5px solid #4080df;
}
.messages-link {
  border: 1.5px solid #ec6161;
}
.filled-link {
  background-color: #4080df;
}
</style>
