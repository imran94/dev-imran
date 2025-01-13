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

const dateInputRegex = /^\d{2}\/\d{2}\/\d{4}$/
const dateCharInputRegex = /\d|\//
const actionKeyRegex = /Arrow*|Backspace|Home|End|Enter|Tab|Delete/

export default {
  components: { NextOfKinForm },
  props: {
    showDialog: Boolean
  },
  emits: ['on-close-button-clicked'],
  data: () => ({
    fetchingOptions: false,

    documentTypes: fixedDocumentTypes,
    nationalities: fixedNationalities,
    occupations: fixedOccupations,
    relationships: fixedRelationships,
    countryCodes: fixedCountryCodes,

    // DOB Input
    showDOBMenu: false,
    userDOB: '',
    minDobDate: '1900-01-01',
    maxDobDate: new Date().toISOString(),

    documentTypeId: null,
    nationalityId: null,
    mobileCountryCodeId: null,

    documentNumber: '',
    chineseName: '',
    surname: '',
    givenName: '',
    sex: '',
    dateOfBirth: '',
    occupation: '',
    prNumber: '',
    homeTelNo: '',
    mobileNumber: '',
    isSeparateMailingAddress: true,
    residentStructureAddressZone: '',
    residentStructureAddressDistrict: '',
    residentStructureAddressSubdistrict: '',
    residentStructureAddressStreet: '',
    residentStructureAddressVillage: '',
    residentStructureAddressEstate: '',
    residentStructureAddressBlock: '',
    residentStructureAddressFloor: '',
    residentStructureAddressFlat: '',
    mailingStructureAddressZone: '',
    mailingStructureAddressDistrict: '',
    mailingStructureAddressSubdistrict: '',
    mailingStructureAddressStreet: '',
    mailingStructureAddressVillage: '',
    mailingStructureAddressEstate: '',
    mailingStructureAddressBlock: '',
    mailingStructureAddressFloor: '',
    mailingStructureAddressFlat: '',
    remark: '',
    email: '',
    isMarketingPurpose: null,
    isCancelSubscription: null,
    smsLanguage: '',
    isRefuseSms: null,
    nextOfKin1Name: '',
    nextOfKin1RelationshipId: null,
    nextOfKin1ContactNumber: '',
    nextOfKin1SmsNumber: '',
    nextOfKin1Remark: '',
    nextOfKin2Name: '',
    nextOfKin2RelationshipId: 0,
    nextOfKin2ContactNumber: '',
    nextOfKin2SmsNumber: '',
    nextOfKin2Remark: '',
    nextOfKin3Name: '',
    nextOfKin3RelationshipId: 0,
    nextOfKin3ContactNumber: '',
    nextOfKin3SmsNumber: '',
    nextOfKin3Remark: '',
    isSensitive: false,
    isOutstandingBill: false,
    outstandingBillReason: '',
    isPersonaNonGrata: false,
    personaNonGrataReason: '',

    dobRules: [
      v => {
        if (!dateInputRegex.test(v)) {
          return false
        }

        const dateObj = new Date(v.split('/').toReversed().join('-'))

        if (dateObj.toString().toLowerCase().includes('invalid')) {
          console.log('dob invalid date')
          return false
        }

        const minDate = new Date('1900')
        const maxDate = new Date()

        if (dateObj < minDate || dateObj > maxDate) {
          console.log('dob out of bounds')
          return false
        }

        console.log('dob correct')
        return true
      }
    ]
  }),
  computed: {
    formattedDate() {
      if (!this.dateOfBirth) return null

      const [year, month, day] = this.dateOfBirth.split('-')
      return `${day}/${month}/${year}`
    }
  },
  mounted() {
    this.fetchOptions()
  },
  methods: {
    async fetchOptions() {
      this.fetchingOptions = true

      console.log('fetchOptions')
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

      this.dateOfBirth = null

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

      this.dateOfBirth = regularUserDob
      console.log('isValidDate', dateObj.toString())
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
      console.log('dateOfBirth Selected', this.dateOfBirth)
      this.showDOBMenu = false
      this.userDOB = this.formattedDate
    }
  }
  // watch: {
  //   dateOfBirth(oldDOB, newDOB) {
  //     console.log('watch dateOfBirth', this.dateOfBirth)
  //     if (!this.dateOfBirth) {
  //       return
  //     }

  //     const regularUserDob = this.userDOB.split('/').toReversed().join('-')
  //     console.log('regularUserDob', regularUserDob)
  //     console.log('dateOBirth', this.dateOfBirth)
  //     if (this.dateOfBirth === regularUserDob) {
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
          text
          icon
          @click="$emit('on-close-button-clicked')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="divider" />

      <v-card-text>
        <v-form class="form">
          <div class="form-section">
            <div class="card-header">
              <div class="form-section-title">Personal Information</div>
            </div>
            <div class="form-content split-columns">
              <div class="colspan-full">
                <v-label for="doc-num">Document No.<span class="alert-text">*</span></v-label>
                <div class="doc-num-input-group">
                  <v-select
                    hide-details
                    class="caption-1"
                    outlined
                    dense
                    placeholder="Document Type"
                    v-model="documentTypeId"
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
                  <v-chip
                    small
                    outlined
                  >
                    Male
                  </v-chip>
                  <v-chip
                    small
                    outlined
                  >
                    Female
                  </v-chip>
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
                    v-model="dateOfBirth"
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
                  v-model="occupation"
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
                  v-model="nationalityId"
                  :items="nationalities"
                  item-text="description"
                  item-value="id"
                  :menu-props="{
                    bottom: true,
                    offsetY: true
                  }"
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
                <v-label>Patient address<span class="alert-text">*</span></v-label>
                <div class="z-stack">
                  <v-textarea
                    style="border-radius: 7px"
                    outlined
                    hide-details
                    disabled
                    no-resize
                    rows="3"
                  />
                  <div class="empty-address-text">Empty</div>
                </div>
              </div>

              <div>
                <v-label>Mailing address<span class="alert-text">*</span></v-label>
                <div class="z-stack">
                  <v-textarea
                    style="border-radius: 7px"
                    outlined
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
                    class="m-checkbox caption-1"
                    label="Marketing purpose"
                    color="#F3BC51"
                    hide-details
                  />
                  <v-checkbox
                    class="m-checkbox caption-1"
                    label="Cancel subscription"
                    color="#F3BC51"
                    hide-details
                  />
                </div>
              </div>

              <div class="label-with-input">
                <v-label>SMS Language & Option<span class="alert-text">*</span></v-label>
                <div class="chip-row">
                  <v-chip
                    small
                    outlined
                    >Eng</v-chip
                  >
                  <v-chip
                    small
                    outlined
                    >Chi</v-chip
                  >
                  <v-checkbox
                    class="m-checkbox caption-1"
                    label="Refuse SMS"
                    color="#F3BC51"
                    hide-details
                  />
                </div>
              </div>
            </div>
          </div>

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
              <v-btn
                rounded
                color="primary"
                class="white--text no-cap"
                >Edit</v-btn
              >
            </div>
            <div class="form-content split-columns">
              <v-checkbox
                class="m-checkbox caption-1 colspan-full"
                label="Sensitive Patient"
                color="#F3BC51"
                hide-details
              />

              <v-checkbox
                class="m-checkbox caption-1"
                label="Outstanding Bill"
                color="#F3BC51"
                hide-details
              />

              <v-checkbox
                class="m-checkbox caption-1"
                label="Persona Non-Grata"
                color="#F3BC51"
                hide-details
                disabled
              />

              <v-textarea
                style="border-radius: 7px"
                outlined
                hide-details
                disabled
                no-resize
                placeholder="Reason"
                rows="5"
              />

              <v-textarea
                style="border-radius: 7px"
                outlined
                hide-details
                disabled
                no-resize
                placeholder="Reason"
                rows="5"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider class="divider" />

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
.card-header {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

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

.label-with-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.form,
.form-content {
  display: grid;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form {
  row-gap: 16px;
}

.form-content {
  padding: 4px 8px;
  row-gap: 8px;
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
</style>

<style>
.chip-row .v-chip {
  padding: 0 6px;
}
</style>
