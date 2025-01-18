<script>
const actionKeyRegex = /Arrow*|Backspace|Home|End|Enter|Tab|Delete/

export default {
  props: {
    formNumber: String,
    required: Boolean,
    relationships: Array,

    name: String,
    relationshipId: Number,
    contactNumber: String,
    smsNumber: String,
    remarks: String,

    disabled: Boolean,
    loading: Boolean,
    selectionLoading: Boolean
  },
  emits: ['update:name', 'update:relationshipId', 'update:contactNumber', 'update:smsNumber', 'update:remarks'],
  data: {
    requiredRule: v => !!v
  },
  computed: {
    resolveRules() {
      if (this.required) {
        return [this.requiredRule]
      }
      return []
    }
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
    },
    updateName(value) {
      this.$emit('update:name', value)
    },
    updateRelationshipId(value) {
      this.$emit('update:relationshipId', value)
    },
    updateContactNumber(value) {
      this.$emit('update:contactNumber', value)
    },
    updateSmsNumber(value) {
      this.$emit('update:smsNumber', value)
    },
    updateRemarks(value) {
      this.$emit('update:remarks', value)
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="caption-1 text-secondary">
      Next of Kin {{ formNumber }}
      <span
        v-if="required"
        class="alert-text"
        >*</span
      >
    </div>

    <div class="form">
      <v-text-field
        :value="name"
        @input="updateName"
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="Next of Kin Name"
        :rules="required ? [v => !!v] : []"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
      />

      <v-select
        :value="relationshipId"
        @change="updateRelationshipId"
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
        :rules="required ? [v => !!v] : []"
        :loading="loading"
        :disabled="disabled"
        :filled="disabled || selectionLoading"
      />
      <v-text-field
        :value="contactNumber"
        @input="updateContactNumber"
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="Contact Number"
        @keydown="filterNumInput"
        :rules="required ? [v => !!v] : []"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
      />
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-map-marker"
        placeholder="SMS"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
        @keydown="filterNumInput"
      />
      <v-text-field
        hide-details
        outlined
        dense
        clearable
        placeholder="Remarks"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
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
