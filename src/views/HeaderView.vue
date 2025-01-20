<template>
  <v-navigation-drawer
    app
    permanent
    :mini-variant="isMenuCollapsed"
    mini-variant-width="76"
    max-width="181"
    class="nav-drawer"
  >
    <v-list>
      <v-list-item
        tabindex="-1"
        v-show="!isMenuCollapsed"
      >
        <img
          class="logo"
          src="@/assets/tabnext-logo.png"
        />
      </v-list-item>

      <v-list-item
        tabindex="-1"
        v-show="isMenuCollapsed"
        class="mini-logo-container"
      >
        <img
          class="mini-logo"
          src="@/assets/tabnext-logo-mini.png"
        />
      </v-list-item>
    </v-list>

    <v-list
      dense
      nav
      class="menu-list"
      :style="{ width: isMenuCollapsed ? '85%' : '95%' }"
    >
      <v-list-item
        tabindex="-1"
        link
        @click="toggleMenu"
        style="border-radius: 7px"
        class="outlined-link align-center justify-center"
        :class="{ 'filled-link': isMenuCollapsed }"
      >
        <v-list-item-icon>
          <v-icon :dark="isMenuCollapsed">mdi-backburger</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Collapse Menu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        tabindex="-1"
        link
        style="border-radius: 32px !important"
      >
        <v-list-item-icon>
          <v-icon>mdi-home-outline</v-icon>
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
        tabindex="-1"
        link
        class="messages-link"
      >
        <v-list-item-icon>
          <v-avatar
            color="#EC6161"
            size="20"
            style="align-self: center"
          >
            <span class="white--text">2</span>
          </v-avatar>
        </v-list-item-icon>

        <v-list-item-content
          class="caption-2"
          style="color: var(--text-primary)"
        >
          Messages
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        tabindex="-1"
        link
        two-line
      >
        <v-list-item-icon style="align-self: center">
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            class="footnote"
            style="color: var(--primary)"
          >
            User
          </v-list-item-title>

          <v-list-item-subtitle class="profile-settings-text"> Profile Settings </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        tabindex="-1"
        link
      >
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="footnote">Sign Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    isMenuCollapsed: false,
    isMenuAutoCollapsed: false
  }),
  mounted() {
    if (window.innerWidth <= 1024) {
      this.isMenuCollapsed = true
      this.isMenuAutoCollapsed = true
    }

    addEventListener('resize', evt => {
      if (window.innerWidth > 1024) {
        this.isMenuAutoCollapsed = false
      }

      if (this.isMenuAutoCollapsed) {
        return
      }

      if (window.innerWidth <= 1024) {
        this.isMenuCollapsed = true
        this.isMenuAutoCollapsed = true
      }
    })
  },
  methods: {
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed
    }
  }
}
</script>

<style scoped>
.nav-drawer {
  padding-top: 24px;
}

.logo {
  max-width: 65%;
  margin: auto;
}

.mini-logo-container {
  width: 100%;
}
.mini-logo {
  max-width: 100%;
  margin: auto;
}

.menu-list {
  margin: 16px 12px 8px;
}

.menu-list-bottom {
  position: fixed;
  bottom: 12px;
}

.mini-icon {
  box-sizing: border-box;
  margin: 8px;
}

.outlined-link {
  border: 1.5px solid var(--primary);
}
.messages-link {
  border: 1.5px solid #ec6161;
}
.filled-link {
  background-color: var(--primary);
}

.profile-settings-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 16.8px;
  color: var(--text-secondary);
}
</style>
