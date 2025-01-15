<script>
export default {
  props: {
    addressType: String
  },
  methods: {
    getField(key) {
      return this.$store.state.address[`${this.addressType}StructureAddress${key}`]
    },
    updateField(key, value) {
      this.$store.commit(`updateAddressFieldByTypeAndKeyValue`, {
        addressType: this.addressType,
        key: key,
        value: value
      })
    }
  },
  computed: {
    zone: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Zone' })
      },
      set(value) {
        this.updateField('Zone', value)
      }
    },
    district: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'District' })
      },
      set(value) {
        this.updateField('District', value)
      }
    },
    subDistrict: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Subdistrict' })
      },
      set(value) {
        this.updateField('Subdistrict', value)
      }
    },
    street: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Street' })
      },
      set(value) {
        this.updateField('Street', value)
      }
    },
    village: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Village' })
      },
      set(value) {
        this.updateField('Village', value)
      }
    },
    estate: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Estate' })
      },
      set(value) {
        this.updateField('Estate', value)
      }
    },
    block: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Block' })
      },
      set(value) {
        this.updateField('Block', value)
      }
    },
    floor: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Floor' })
      },
      set(value) {
        this.updateField('Floor', value)
      }
    },
    flat: {
      get() {
        return this.$store.getters.getAddressFieldByTypeAndKey({ addressType: this.addressType, key: 'Flat' })
      },
      set(value) {
        this.updateField('Flat', value)
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
          v-model="district"
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
        v-model="subDistrict"
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
        v-model="street"
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
        v-model="village"
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
        v-model="estate"
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
        v-model="block"
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
          v-model="floor"
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
          v-model="flat"
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
