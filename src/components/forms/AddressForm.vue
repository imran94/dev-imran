<script>
export default {
  props: {
    addressType: String,
    district: String,
    subDistrict: String,
    street: String,
    village: String,
    estate: String,
    block: String,
    floor: String,
    flat: String
  },
  emits: [
    'update:zone',
    'update:district',
    'update:sub-district',
    'update:street',
    'update:village',
    'update:estate',
    'update:block',
    'update:floor',
    'update:flat'
  ],
  methods: {
    updateDistrict(value) {
      this.$emit('update:district', value)
    },
    updateSubDistrict(value) {
      this.$emit('update:sub-district', value)
    },
    updateStreet(value) {
      this.$emit('update:street', value)
    },
    updateVillage(value) {
      this.$emit('update:village', value)
    },
    updateEstate(value) {
      this.$emit('update:estate', value)
    },
    updateBlock(value) {
      this.$emit('update:block', value)
    },
    updateFloor(value) {
      this.$emit('update:floor', value)
    },
    updateFlat(value) {
      this.$emit('update:flat', value)
    }
  },
  computed: {
    zone: {
      get() {
        return this.$store.state.address['resident']['zone']
      },
      set(value) {
        this.$store.commit('updateAddressByTypeAndKeyValue', this.addressType, 'zone', value)
      }
    }
  }
}
</script>

<template>
  <div class="address-form-content border border-primary">
    <div class="split-grid">
      <div>
        <v-label>Zone</v-label>
        <v-text-field
          v-model="zone"
          hide-details
          outlined
          dense
          clearable
          placeholder="Zone"
        />
      </div>

      <div>
        <v-label>District</v-label>
        <v-text-field
          :value="district"
          @input="updateDistrict"
          hide-details
          outlined
          dense
          clearable
          placeholder="District"
        />
      </div>
    </div>

    <div>
      <v-label>Sub-District</v-label>
      <v-text-field
        :value="subDistrict"
        @input="updateSubDistrict"
        hide-details
        outlined
        dense
        clearable
        placeholder="Sub-District"
      />
    </div>

    <div>
      <v-label>Street</v-label>
      <v-text-field
        :value="street"
        @input="updateStreet"
        hide-details
        outlined
        dense
        clearable
        placeholder="Street"
      />
    </div>

    <div>
      <v-label>Village</v-label>
      <v-text-field
        :value="village"
        @input="updateVillage"
        hide-details
        outlined
        dense
        clearable
        placeholder="Village"
      />
    </div>

    <div>
      <v-label>Estate</v-label>
      <v-text-field
        :value="estate"
        @input="updateEstate"
        hide-details
        outlined
        dense
        clearable
        placeholder="Estate"
      />
    </div>

    <div>
      <v-label>Block / Building Others (Non-Residential)</v-label>
      <v-text-field
        :value="block"
        @input="updateBlock"
        hide-details
        outlined
        dense
        clearable
        placeholder="Block / Building Others (Non-Residential)"
      />
    </div>

    <div class="split-grid">
      <div>
        <v-label>Floor</v-label>
        <v-text-field
          :value="floor"
          @input="updateFloor"
          hide-details
          outlined
          dense
          clearable
          placeholder="Floor"
        />
      </div>

      <div>
        <v-label>Flat</v-label>
        <v-text-field
          :value="flat"
          @input="updateFlat"
          hide-details
          outlined
          dense
          clearable
          placeholder="Flat"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-form-content {
  padding: 4px 8px;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.split-grid {
  display: grid;
  grid-template: 100% / repeat(2, 1fr);
  column-gap: 16px;
}
</style>
