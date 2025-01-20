<script>
let timeoutTracker = null

export default {
  props: {
    show: Boolean,
    title: String,
    message: String,
    progressBarColor: String
  },
  emits: ['on-close'],
  data: () => ({
    timeoutProgress: 100
  }),
  watch: {
    show(v) {
      if (!v) {
        return
      }

      this.timeoutProgress = 100
      clearInterval(timeoutTracker)
      timeoutTracker = setInterval(() => {
        if (this.timeoutProgress < 0) {
          this.handleClose()
        }

        this.timeoutProgress -= (50 / 5000) * 100
      }, 50)
    }
  },
  methods: {
    handleClose() {
      clearInterval(timeoutTracker)
      this.$emit('on-close')
    }
  }
}
</script>

<template>
  <v-snackbar
    :value="show"
    @input="handleClose"
    width="500"
    multi-line
    light
    color="white"
  >
    <div class="aloha-snackbar">
      <div class="header">
        <div class="title-1">{{ title }}</div>

        <v-btn
          text
          icon
          @click="handleClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="message-text">{{ message }}</div>
      <v-progress-linear
        v-model="timeoutProgress"
        :color="progressBarColor"
      />
    </div>
  </v-snackbar>
</template>

<style scoped>
.aloha-snackbar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.header {
  /* width: 100%; */

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin: 4px 0 1px 0;
}

.message-text {
  font-size: 18px;
  font-weight: 400;
  line-height: 21.6px;

  text-align: center;
}
</style>
