<script>
import AddressForm from './AddressForm.vue'
export default {
  components: { AddressForm },
  props: {
    showDialog: Boolean
  },
  emits: ['on-close', 'on-save'],
  data: () => ({}),
  computed: {
    isSeparateMailingAddress: {
      get() {
        return this.$store.state.isSeparateMailingAddress
      },
      set(value) {
        this.$store.commit('updateIsSeparateMailingAddress', value)
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('on-close')
    },
    handleSave() {
      this.$emit('on-save')
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="750"
  >
    <v-card>
      <v-card-title class="card-header">
        <div class="title-1">Address Input</div>
        <v-btn
          icon
          outlined
          @click="$emit('on-close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="main">
        <div class="mailing-address-option">
          <div class="caption-1 text-secondary">Mailing Address Option</div>

          <v-checkbox
            v-model="isSeparateMailingAddress"
            label="Separate Mailing Address"
            class="m-checkbox"
            hide-details
            color="#F3BC51"
          />
        </div>

        <div class="address-forms">
          <div class="address-form">
            <div class="subheadline form-heading">Address</div>
            <address-form address-type="resident" />
          </div>

          <div
            class="address-form"
            v-show="isSeparateMailingAddress"
          >
            <div class="subheadline form-heading">Mailing Address</div>
            <address-form address-type="mailing" />
          </div>
        </div>
      </v-card-text>

      <v-card-actions style="justify-content: flex-end">
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          outlined
          @click="handleCancel"
          >Cancel</v-btn
        >
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          @click="handleSave"
        >
          <v-icon
            left
            dark
          >
            mdi-content-save-outline
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.main,
.mailing-address-option,
.address-forms {
  display: flex;
  flex-direction: column;
}

.main {
  padding: 8px;
  gap: 8px;
}

.mailing-address-option {
  gap: 4px;
}

.m-checkbox {
  margin-top: 4px;
  padding-top: 0;
}

.address-forms {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.address-form {
  flex-grow: 1;
  gap: 4px;
}

.form-heading {
  font-weight: 700;
  color: var(--text-primary);
}
</style>
