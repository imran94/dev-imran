<script>
import {
  fixedDocumentTypes,
  fixedCountryCodes,
  fixedNationalities,
  fixedOccupations,
  fixedRelationships
} from '@/utils/formSelections'
import { BASE_URL } from '@/utils/network'
import NextOfKinForm from './NextOfKinForm.vue'
import AddressFormDialog from './AddressFormDialog.vue'
import { blankPatient } from '../../utils/patients'

const dateInputRegex = /^\d{2}\/\d{2}\/\d{4}$/
const dateCharInputRegex = /\d|\//
const actionKeyRegex = /Arrow*|Backspace|Home|End|Enter|Tab|Delete/

export default {
  components: { NextOfKinForm, AddressFormDialog },
  props: {
    showDialog: Boolean,
    patiendId: Number
  },
  emits: ['on-close'],
  data() {
    return {
      fetchingOptions: false,

      documentTypes: fixedDocumentTypes,
      nationalities: fixedNationalities,
      occupations: fixedOccupations,
      relationships: fixedRelationships,
      countryCodes: fixedCountryCodes,

      cancellationDialog: false,

      // DOB Input
      showDOBMenu: false,
      addressFormDialogShowing: false,
      userDOB: '',
      minDobDate: '1925-01-01',
      maxDobDate: new Date().toISOString(),

      // Form Data
      valid: true,

      patientForm: blankPatient(),

      requiredRule: v => !!v,
      dobRules: [
        v => {
          if (!dateInputRegex.test(v)) {
            return false
          }

          const dateObj = new Date(v.split('/').toReversed().join('-'))

          if (dateObj.toString().toLowerCase().includes('invalid')) {
            return false
          }

          const minDate = new Date('1900')
          const maxDate = new Date()

          if (dateObj < minDate || dateObj > maxDate) {
            return false
          }

          return true
        }
      ]
    }
  },
  computed: {
    formattedDate() {
      if (!this.patientForm.dateOfBirth) return null

      const [year, month, day] = this.patientForm.dateOfBirth.split('-')
      return `${day}/${month}/${year}`
    }
  },
  mounted() {
    this.fetchOptions()
  },
  methods: {
    async fetchOptions() {
      this.fetchingOptions = true

      const resArr = await Promise.all([
        fetch(new URL('Configs/DocumentType', BASE_URL)),
        fetch(new URL('Configs/Nationality', BASE_URL)),
        fetch(new URL('Configs/Occupation', BASE_URL)),
        fetch(new URL('Configs/Relationship', BASE_URL)),
        fetch(new URL('Configs/MobileCountryCode', BASE_URL))
      ])

      const [documentTypes, nationalities, occupations, relationships, countryCodes] = await Promise.all(
        resArr.map(r => r.json())
      )

      this.documentTypes = documentTypes
      this.nationalities = nationalities
      this.occupations = occupations
      this.relationships = relationships
      this.countryCodes = countryCodes

      this.fetchingOptions = false
    },
    handleDOBInput(dob) {
      if (dob.length === 3 && dob.charAt(dob.length - 1) !== '/') {
        dob = `${dob.slice(0, 2)}/${dob.slice(2)}`
      }

      if (dob.length === 6 && dob.charAt(dob.length - 1) !== '/') {
        dob = `${dob.slice(0, 5)}/${dob.slice(5)}`
      }

      this.userDOB = dob

      if (!dateInputRegex.test(this.userDOB)) {
        return
      }

      this.patientForm.dateOfBirth = null

      const regularUserDob = this.userDOB.split('/').toReversed().join('-')
      const dateObj = new Date(regularUserDob)

      if (dateObj.toString().toLowerCase().includes('invalid')) {
        return
      }

      const minDate = new Date(this.minDobDate)
      const maxDate = new Date(this.maxDobDate)

      if (dateObj < minDate || dateObj > maxDate) {
        return
      }

      this.patientForm.dateOfBirth = regularUserDob
    },
    filterDateInput(evt) {
      if (
        this.userDOB.length >= 10 &&
        !actionKeyRegex.test(evt.key) &&
        !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a'))
      ) {
        evt.preventDefault()
      }

      if (
        !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a')) &&
        !dateCharInputRegex.test(evt.key) &&
        !actionKeyRegex.test(evt.key)
      ) {
        evt.preventDefault()
      }
    },
    handleDobSelection() {
      this.showDOBMenu = false
      this.userDOB = this.formattedDate
    },
    resolveChoiceButtonColor(value, desiredValue) {
      if (!value) {
        if (!this.valid) {
          return 'error'
        }
        return '8E8E8E'
      }
      if (value === desiredValue) return 'primary'
      return '#C4C4C4'
    },
    showAddressFormDialog() {
      this.addressFormDialogShowing = true
    },
    handleFormSubmission() {
      this.$refs.form.validate()
    },
    confirmCancel() {
      this.cancellationDialog = true
    },
    closeFormDialog() {
      this.cancellationDialog = false
      this.$emit('on-close')
    }
  }
  // watch: {
  //   patientForm.dateOfBirth(oldDOB, newDOB) {
  //     console.log('watch patientForm.dateOfBirth', this.patientForm.dateOfBirth)
  //     if (!this.patientForm.dateOfBirth) {
  //       return
  //     }

  //     const regularUserDob = this.userDOB.split('/').toReversed().join('-')
  //     console.log('regularUserDob', regularUserDob)
  //     console.log('dateOBirth', this.patientForm.dateOfBirth)
  //     if (this.patientForm.dateOfBirth === regularUserDob) {
  //       console.log('returning')
  //       return
  //     }

  //     this.userDOB = this.formattedDate
  //     console.log('new DOB', newDOB)
  //   }
  // }
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    persistent
  >
    <v-card>
      <v-card-title class="card-header">
        <div class="title-1">Create New Patient</div>
        <v-btn
          icon
          outlined
          @click="$emit('on-close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider" />

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          class="form"
          lazy-validation
        >
          <div class="form-column">
            <div class="form-section">
              <div class="card-header">
                <div class="form-section-title">Personal Information</div>
              </div>
              <div class="form-content split-columns">
                <div class="colspan-full">
                  <v-label for="doc-num">Document No.<span class="alert-text">*</span></v-label>
                  <div class="doc-num-input-group">
                    <v-select
                      v-model="patientForm.documentTypeId"
                      :rules="[requiredRule]"
                      hide-details
                      class="caption-1"
                      outlined
                      dense
                      placeholder="Document Type"
                      :items="documentTypes"
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
                      v-model="patientForm.documentNumber"
                      :rules="[requiredRule]"
                      id="doc-num"
                      hide-details
                      outlined
                      dense
                      clearable
                      placeholder="Document No."
                    />
                  </div>
                </div>
                <div>
                  <v-label>Surname<span class="alert-text">*</span></v-label>
                  <v-text-field
                    v-model="patientForm.surname"
                    :rules="[requiredRule]"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Surname"
                  />
                </div>
                <div>
                  <v-label>Given Name<span class="alert-text">*</span></v-label>
                  <v-text-field
                    v-model="patientForm.givenName"
                    :rules="[requiredRule]"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Given Name"
                  />
                </div>
                <div>
                  <v-label>中文姓名</v-label>
                  <v-text-field
                    v-model="patientForm.chineseName"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="中文姓名"
                  />
                </div>
                <div>
                  <v-label>Sex<span class="alert-text">*</span></v-label>
                  <div class="chip-row">
                    <v-btn
                      x-small
                      rounded
                      style="font-weight: 700"
                      class="caption-2 no-cap"
                      :outlined="patientForm.sex !== 'Male'"
                      @click="patientForm.sex = 'Male'"
                      :color="resolveChoiceButtonColor(patientForm.sex, 'Male')"
                    >
                      Male
                    </v-btn>
                    <v-btn
                      x-small
                      rounded
                      style="font-weight: 700"
                      class="caption-2 no-cap"
                      :outlined="patientForm.sex !== 'Female'"
                      @click="patientForm.sex = 'Female'"
                      :color="resolveChoiceButtonColor(patientForm.sex, 'Female')"
                    >
                      Female
                    </v-btn>
                  </div>
                </div>
                <div>
                  <v-label>Date of Birth<span class="alert-text">*</span></v-label>
                  <v-menu
                    v-model="showDOBMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <!-- v-bind="attrs" -->
                    <!-- v-on="on" -->
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="userDOB"
                        @input="handleDOBInput"
                        @keydown="filterDateInput"
                        hide-details
                        outlined
                        dense
                        append-icon="mdi-calendar"
                        placeholder="DD/MM/YYYY"
                        :rules="dobRules"
                        @click:append="showDOBMenu = true"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="patientForm.dateOfBirth"
                      :min="minDobDate"
                      :max="maxDobDate"
                      @input="handleDobSelection"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <div>
                  <v-label>Occupation</v-label>
                  <v-autocomplete
                    hide-details
                    outlined
                    dense
                    v-model="patientForm.occupation"
                    :items="nationalities"
                    item-text="description"
                    placeholder="Occupation"
                  />
                </div>
                <div>
                  <v-label>Nationality<span class="alert-text">*</span></v-label>
                  <v-select
                    hide-details
                    class="caption-1"
                    outlined
                    dense
                    placeholder="Nationality"
                    v-model="patientForm.nationalityId"
                    :items="nationalities"
                    item-text="description"
                    item-value="id"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :rules="[requiredRule]"
                    :loading="fetchingOptions"
                    :disabled="fetchingOptions"
                  />
                </div>
                <div>
                  <v-label>PR No.</v-label>
                  <v-text-field
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="PR No."
                  />
                </div>
                <div>
                  <v-label>Mobile No.<span class="alert-text">*</span></v-label>
                  <v-text-field
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Mobile No."
                    :rules="[requiredRule]"
                  />
                </div>
                <div>
                  <v-label>Tel No. (Home)</v-label>
                  <v-text-field
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Tel No. (Home)"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="card-header">
                <div class="form-section-title">Address</div>
                <v-btn
                  small
                  color="primary"
                  class="white--text caption-2 no-cap"
                  rounded
                  @click="showAddressFormDialog"
                >
                  <v-icon
                    left
                    dark
                  >
                    mdi-cloud-upload
                  </v-icon>
                  Edit Address
                </v-btn>
              </div>
              <div class="form-content split-columns">
                <div>
                  <v-label>Patient Address<span class="alert-text">*</span> </v-label>
                  <div class="z-stack">
                    <v-textarea
                      class="border"
                      :class="{
                        'border-primary': valid,
                        'border-alert': !valid
                      }"
                      hide-details
                      disabled
                      no-resize
                      rows="3"
                    />
                    <div class="empty-address-text">Empty</div>
                  </div>
                </div>

                <div>
                  <v-label>Mailing Address<span class="alert-text">*</span></v-label>
                  <div class="z-stack">
                    <v-textarea
                      class="border"
                      :class="{
                        'border-primary': valid,
                        'border-alert': !valid
                      }"
                      hide-details
                      disabled
                      no-resize
                      rows="3"
                    />
                    <div class="empty-address-text">Empty</div>
                  </div>
                </div>

                <div>
                  <v-label>Remarks</v-label>
                  <v-text-field
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Remarks"
                  />
                </div>

                <div>
                  <v-label>Email</v-label>
                  <v-text-field
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Email"
                  />
                </div>

                <div class="label-with-input">
                  <v-label>Mailing List</v-label>
                  <div
                    class="spaced-row"
                    style="height: 60%"
                  >
                    <v-checkbox
                      class="m-checkbox caption-1 bold"
                      label="Marketing purpose"
                      color="#F3BC51"
                      hide-details
                    />
                    <v-checkbox
                      class="m-checkbox caption-1 bold"
                      label="Cancel subscription"
                      color="#F3BC51"
                      hide-details
                    />
                  </div>
                </div>

                <div class="label-with-input">
                  <v-label>SMS Language & Option<span class="alert-text">*</span></v-label>
                  <div class="chip-row">
                    <v-btn
                      x-small
                      rounded
                      style="font-weight: 700"
                      class="caption-2 no-cap"
                      :outlined="patientForm.smsLanguage !== 'Eng'"
                      @click="patientForm.smsLanguage = 'Eng'"
                      :color="resolveChoiceButtonColor(patientForm.smsLanguage, 'Eng')"
                    >
                      Eng
                    </v-btn>

                    <v-btn
                      x-small
                      rounded
                      style="font-weight: 700"
                      class="caption-2 no-cap"
                      :outlined="patientForm.smsLanguage !== 'Chi'"
                      @click="patientForm.smsLanguage = 'Chi'"
                      :color="resolveChoiceButtonColor(patientForm.smsLanguage, 'Chi')"
                    >
                      Chi
                    </v-btn>
                    <v-checkbox
                      class="m-checkbox caption-1 bold"
                      label="Refuse SMS"
                      color="#F3BC51"
                      hide-details
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-column">
            <div class="form-section">
              <div class="card-header">
                <div class="form-section-title">Next of Kin</div>
              </div>
              <div class="form-content next-of-kin-section">
                <next-of-kin-form
                  form-number="1"
                  :relationships="relationships"
                  :fetching-options="fetchingOptions"
                  required
                />

                <next-of-kin-form
                  form-number="2"
                  :relationships="relationships"
                  :fetching-options="fetchingOptions"
                />

                <next-of-kin-form
                  form-number="3"
                  :relationships="relationships"
                  :fetching-options="fetchingOptions"
                />
              </div>
            </div>

            <div class="form-section">
              <div class="card-header">
                <div class="form-section-title">Special Status</div>
              </div>
              <div class="form-content split-columns">
                <v-checkbox
                  class="m-checkbox caption-1 colspan-full bold"
                  label="Sensitive Patient"
                  color="#F3BC51"
                  hide-details
                />

                <v-checkbox
                  v-model="patientForm.isOutstandingBill"
                  class="m-checkbox caption-1 bold"
                  label="Outstanding Bill"
                  color="#F3BC51"
                  hide-details
                />

                <v-checkbox
                  v-model="patientForm.isPersonaNonGrata"
                  class="m-checkbox caption-1 bold"
                  label="Persona Non-Grata"
                  color="#F3BC51"
                  hide-details
                  disabled
                />

                <v-textarea
                  :filled="!patientForm.isOutstandingBill"
                  :disabled="!patientForm.isOutstandingBill"
                  style="border-radius: 7px"
                  outlined
                  hide-details
                  no-resize
                  placeholder="Reason"
                />

                <v-textarea
                  :filled="!patientForm.isPersonaNonGrata"
                  style="border-radius: 7px"
                  outlined
                  hide-details
                  disabled
                  no-resize
                  placeholder="Reason"
                />
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <address-form-dialog
        :show-dialog="addressFormDialogShowing"
        @on-close="addressFormDialogShowing = false"
      />

      <v-divider class="divider" />

      <v-card-actions style="justify-content: flex-end">
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          outlined
          @click="confirmCancel"
          >Cancel</v-btn
        >

        <v-btn
          class="no-cap"
          color="primary"
          rounded
          @click="handleFormSubmission"
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

      <v-dialog
        v-model="cancellationDialog"
        width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="title-1">Confirmation</span>
          </v-card-title>
          <v-card-text> Are you sure you want to cancel without saving? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="no-cap"
              color="primary"
              rounded
              outlined
              @click="cancellationDialog = false"
              >No</v-btn
            >

            <v-btn
              class="no-cap"
              color="primary"
              rounded
              @click="closeFormDialog"
            >
              <v-icon
                left
                dark
              >
                mdi-check
              </v-icon>
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.divider {
  margin: 12px 8px;
}

.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}

.m-checkbox {
  margin-top: 0;
  padding-top: 0;
  align-self: center;
}
.bold {
  font-weight: 700;
  color: var(--text-primary);
}

.label-with-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.form,
.form-column,
.form-content {
  display: grid;
}

.form {
  column-gap: 8px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.form,
.form-column {
  row-gap: 16px;
}

.form-column {
  align-content: start;
  height: 100%;
  grid-auto-rows: max-content;
}

.form-content {
  padding: 4px 8px;
  row-gap: 8px;
  flex-grow: 1;
  grid-auto-rows: max-content;
}

.form-section-title {
  font-weight: 700;
  font-size: 22px;
  line-height: 26.4px;
  color: var(--text-primary);
}

.split-columns {
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 8px;
}

.next-of-kin-section {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  gap: 8px;
}

.colspan-full {
  grid-column: 1 / -1;
}
.doc-num-input-group {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 20% 1fr;
  gap: 4px;
}

.chip-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  height: 60%;
}

.z-stack {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
.z-stack * {
  grid-area: 1 / 1 / 1 / 1;
}
.empty-address-text {
  color: var(--text-secondary);
  align-self: center;
  justify-self: center;
}

@media (width >= 1400px) {
  .form {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<style>
.chip-row .v-chip {
  padding: 0 6px;
}
</style>
