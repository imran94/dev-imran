<script>
const actionKeyRegex = /Arrow*|Backspace|Home|End|Enter|Tab|Delete/

export default {
  props: {
    formNumber: String,
    required: Boolean,
    relationships: Array,
    firstTabIndex: Number,

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
        :tabindex="firstTabIndex + 4"
        :value="name"
        @input="updateName"
        hide-details
        outlined
        dense
        clearable
        placeholder='"Next of Kin Name"'
        :rules="required ? [v => !!v] : []"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
      >
        <template v-slot:prepend>
          <v-icon color="#333333"> mdi-account-outline </v-icon>
        </template>
      </v-text-field>

      <v-select
        :tabindex="firstTabIndex + 3"
        :value="relationshipId"
        @change="updateRelationshipId"
        hide-details
        class="caption-1"
        outlined
        dense
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
      >
        <template v-slot:prepend>
          <v-icon color="#333333"> mdi-account-supervisor-outline </v-icon>
        </template>
      </v-select>

      <v-text-field
        :tabindex="firstTabIndex + 2"
        :value="contactNumber"
        @input="updateContactNumber"
        hide-details
        outlined
        dense
        clearable
        placeholder="Contact Number"
        @keydown="filterNumInput"
        :rules="required ? [v => !!v] : []"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
      >
        <template v-slot:prepend>
          <v-icon color="#333333"> mdi-cellphone </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        :tabindex="firstTabIndex + 1"
        hide-details
        outlined
        dense
        clearable
        prepend-icon="mdi-message-outline"
        placeholder="SMS"
        :disabled="disabled"
        :loading="loading"
        :filled="disabled"
        @keydown="filterNumInput"
      >
        <template v-slot:prepend>
          <v-icon color="#333333">mdi-message-outline</v-icon>
        </template>
      </v-text-field>
      <v-text-field
        :tabindex="firstTabIndex"
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
