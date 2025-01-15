<script>
import AddressForm from './AddressForm.vue'
export default {
  components: { AddressForm },
  props: {
    showDialog: Boolean
  },
  emits: ['on-close'],
  data: () => ({
    district: '',
    subDistrict: '',
    street: '',
    village: '',
    estate: '',
    block: '',
    floor: '',
    flat: ''
  }),
  computed: {
    isSeparateMailingAddress: {
      get() {
        return this.$store.state.isSeparateMailingAddress
      },
      set(value) {
        this.$store.commit('updateIsSeparateMailingAddress', value)
      }
    },
    zone() {
      return this.$store.state.address.resident.zone
    }
  },
  methods: {
    handleZoneUpdate(value) {
      this.zone = value
    },
    handleDistrictUpdate(value) {
      this.district = value
    },
    handleSubDistrictUpdate(value) {
      this.subDistrict = value
    },
    handleStreetUpdate(value) {
      this.street = value
    },
    handleVillageUpdate(value) {
      this.village = value
    },
    handleEstateUpdate(value) {
      this.estate = value
    },
    handleBlockUpdate(value) {
      this.block = value
    },
    handleFloorUpdate(value) {
      this.floor = value
    },
    handleFlatUpdate(value) {
      this.flat = value
    },
    handleSubmit() {}
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
        <div>Zone: {{ zone }}</div>
        <div>district: {{ district }}</div>
        <div>subDistrict: {{ subDistrict }}</div>
        <div>street: {{ street }}</div>
        <div>village: {{ village }}</div>
        <div>estate: {{ estate }}</div>
        <div>block: {{ block }}</div>
        <div>floor: {{ floor }}</div>
        <div>flat: {{ flat }}</div>

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
            <address-form
              address-type="resident"
              :district="district"
              :sub-district="subDistrict"
              :street="street"
              :village="village"
              :estate="estate"
              :block="block"
              :floor="floor"
              :flat="flat"
              @update:district="handleDistrictUpdate"
              @update:sub-district="handleSubDistrictUpdate"
              @update:street="handleStreetUpdate"
              @update:village="handleVillageUpdate"
              @update:estate="handleEstateUpdate"
              @update:block="handleBlockUpdate"
              @update:floor="handleFloorUpdate"
              @update:flat="handleFlatUpdate"
            />
          </div>

          <div
            class="address-form"
            v-show="isSeparateMailingAddress"
          >
            <div class="subheadline form-heading">Mailing Address</div>
            <address-form />
          </div>
        </div>
      </v-card-text>

      <v-card-actions style="justify-content: flex-end">
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          outlined
          >Cancel</v-btn
        >
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          @click="handleSubmit"
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
