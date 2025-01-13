<script>
const actionKeyRegex = /Arrow*|Backspace|Home|End|Enter|Tab|Delete/

export default {
  props: {
    formNumber: Number,
    required: Boolean,
    relationships: Array,
    fetchingOptions: Boolean
  },
  methods: {
    filterNumInput(evt) {
      if (
        !/\d/.test(evt.key) &&
        !actionKeyRegex.test(evt.key) &&
        !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a'))
      ) {
        evt.preventDefault()
      }
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="caption-1">
      Next of Kin {{ formNumber }}
      <span
        v-if="required"
        class="alert-text"
        >*</span
      >
    </div>

    <div class="form">
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="Next of Kin Name"
      />

      <v-select
        hide-details
        class="caption-1"
        outlined
        dense
        prepend-icon="mdi-map-marker"
        placeholder="Relationship"
        :items="relationships"
        item-text="description"
        item-value="id"
        :menu-props="{
          bottom: true,
          offsetY: true
        }"
        :loading="fetchingOptions"
        :disabled="fetchingOptions"
      />
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="Contact Number"
        @keydown="filterNumInput"
      />
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="SMS"
        @keydown="filterNumInput"
      />
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        placeholder="Remarks"
      />
    </div>
  </div>
</template>

<style scoped>
.main,
.form {
  display: flex;
  flex-direction: column;
}

.main {
  width: 100%;
  gap: 4px;
  margin: 4px 0;
}

.form {
  border: 2px solid var(--primary);
  border-radius: 7px;
  gap: 12px;
  padding: 12px;
}
</style>
