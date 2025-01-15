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
      ],
      emailRule: v => {
        if (v) {
          return /.+@.+/.test(v)
        }
        return true
      },

      // Form Data
      valid: true,
      patientForm: blankPatient(),
      isSubmitting: false
    }
  },
  computed: {
    formattedDate() {
      if (!this.patientForm.dateOfBirth) return null

      const [year, month, day] = this.patientForm.dateOfBirth.split('-')
      return `${day}/${month}/${year}`
    },
    fullResidentAddress() {
      let addressStr = ''
      if (this.patientForm.residentStructureAddressFlat) {
        addressStr += this.patientForm.residentStructureAddressFlat + ', '
      }
      if (this.patientForm.residentStructureAddressFlorr) {
        addressStr += this.patientForm.residentStructureAddressFloor + ', '
      }
      if (this.patientForm.residentStructureAddressBlock) {
        addressStr += this.patientForm.residentStructureAddressBlock + ', '
      }
      if (this.patientForm.residentStructureAddressEstate) {
        addressStr += this.patientForm.residentStructureAddressEstate + ', '
      }
      if (this.patientForm.residentStructureAddressVillage) {
        addressStr += this.patientForm.residentStructureAddressVillage + ',\n'
      }
      if (this.patientForm.residentStructureAddressStreet) {
        addressStr += this.patientForm.residentStructureAddressStreet + ', '
      }
      if (this.patientForm.residentStructureAddressSubdistrict) {
        addressStr += this.patientForm.residentStructureAddressSubdistrict + ',\n'
      }
      if (this.patientForm.residentStructureAddressDistrict) {
        addressStr += this.patientForm.residentStructureAddressDistrict + ', '
      }
      if (this.patientForm.residentStructureAddressZone) {
        addressStr += this.patientForm.residentStructureAddressZone
      }
      return addressStr
    },
    fullMailingAddress() {
      let addressStr = ''
      if (this.patientForm.mailingStructureAddressFlat) {
        addressStr += this.patientForm.mailingStructureAddressFlat + ', '
      }
      if (this.patientForm.mailingStructureAddressFlorr) {
        addressStr += this.patientForm.mailingStructureAddressFloor + ', '
      }
      if (this.patientForm.mailingStructureAddressBlock) {
        addressStr += this.patientForm.mailingStructureAddressBlock + ', '
      }
      if (this.patientForm.mailingStructureAddressEstate) {
        addressStr += this.patientForm.mailingStructureAddressEstate + ', '
      }
      if (this.patientForm.mailingStructureAddressVillage) {
        addressStr += this.patientForm.mailingStructureAddressVillage + ','
      }
      if (addressStr) {
        addressStr += '\n'
      }
      if (this.patientForm.mailingStructureAddressStreet) {
        addressStr += this.patientForm.mailingStructureAddressStreet + ', '
      }
      if (this.patientForm.mailingStructureAddressSubdistrict) {
        addressStr += this.patientForm.mailingStructureAddressSubdistrict + ','
      }
      if (addressStr) {
        addressStr += '\n'
      }
      if (this.patientForm.mailingStructureAddressDistrict) {
        addressStr += this.patientForm.mailingStructureAddressDistrict + ', '
      }
      if (this.patientForm.mailingStructureAddressZone) {
        addressStr += this.patientForm.mailingStructureAddressZone
      }
      return addressStr
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
      // if (
      //   this.userDOB.length >= 10 &&
      //   !actionKeyRegex.test(evt.key) &&
      //   !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a'))
      // ) {
      //   evt.preventDefault()
      // }

      if (
        !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a')) &&
        !dateCharInputRegex.test(evt.key) &&
        !actionKeyRegex.test(evt.key)
      ) {
        evt.preventDefault()
      }
    },
    filterNumInput(evt) {
      if (
        !/\d/.test(evt.key) &&
        !actionKeyRegex.test(evt.key) &&
        !(evt.ctrlKey && (evt.key === 'z' || evt.key === 'a'))
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
      this.$store.commit('setAddressFieldsFromPatientData', this.patientForm)
      this.addressFormDialogShowing = true
    },
    saveAddress() {
      this.addressFormDialogShowing = false
      this.patientForm.isSeparateMailingAddress = this.$store.state.isSeparateMailingAddress
      console.log(`saveAddress - sub-district: ${this.patientForm.residentStructureAddressSubdistrict}`)
      for (const [key, value] of Object.entries(this.$store.state.addressFields)) {
        this.patientForm[key] = value
      }
      // this.$store.
    },
    async handleFormSubmission() {
      this.isSubmitting = true

      this.$refs.form.validate()
      if (!this.valid) {
        this.isSubmitting = false
        return
      }

      const url = new URL('Patients', BASE_URL)
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(this.patientForm)
        })
        console.log('POST res', res)
        const data = await res.json()
        console.log('POST data', data)
      } catch (err) {
        console.error(err)
      }

      this.isSubmitting = false
    },
    confirmCancel() {
      this.cancellationDialog = true
    },
    closeFormDialog() {
      this.cancellationDialog = false
      this.$emit('on-close')
    }
  }
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
                  <div class="selection-text-group doc-num">
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
                    :items="occupations"
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
                    v-model="patientForm.prNumber"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="PR No."
                  />
                </div>
                <div>
                  <v-label>Mobile No.<span class="alert-text">*</span></v-label>
                  <div class="selection-text-group mobile-num">
                    <v-select
                      v-model="patientForm.mobileCountryCodeId"
                      :rules="[requiredRule]"
                      hide-details
                      class="caption-1"
                      outlined
                      dense
                      placeholder="Country Code"
                      :items="countryCodes"
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
                      v-model="patientForm.mobileNumber"
                      @keydown="filterNumInput"
                      hide-details
                      outlined
                      dense
                      clearable
                      placeholder="Mobile No."
                      :rules="[requiredRule]"
                    />
                  </div>
                </div>
                <div>
                  <v-label>Tel No. (Home)</v-label>
                  <v-text-field
                    v-model="patientForm.homeTelNo"
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
                      :value="fullResidentAddress"
                      class="border textarea-no-spacing"
                      :class="{
                        'border-primary': valid || fullResidentAddress,
                        'border-alert': !fullResidentAddress && !valid
                      }"
                      hide-details
                      disabled
                      no-resize
                      rows="3"
                    />
                    <div
                      v-show="!fullResidentAddress"
                      class="empty-address-text"
                    >
                      Empty
                    </div>
                  </div>
                </div>

                <div>
                  <v-label>Mailing Address<span class="alert-text">*</span></v-label>
                  <div class="z-stack">
                    <v-textarea
                      :value="fullMailingAddress"
                      class="border textarea-no-spacing"
                      :class="{
                        'border-primary': valid || fullMailingAddress,
                        'border-alert': !fullMailingAddress && !valid
                      }"
                      hide-details
                      disabled
                      no-resize
                      rows="3"
                    />
                    <div
                      v-show="!fullMailingAddress"
                      class="empty-address-text"
                    >
                      Empty
                    </div>
                  </div>
                </div>

                <div>
                  <v-label>Remarks</v-label>
                  <v-text-field
                    v-model="patientForm.remark"
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
                    v-model="patientForm.email"
                    :rules="[emailRule]"
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
                      v-model="patientForm.isMarketingPurpose"
                      class="m-checkbox caption-1 bold"
                      label="Marketing purpose"
                      color="#F3BC51"
                      hide-details
                    />
                    <v-checkbox
                      v-model="patientForm.isCancelSubscription"
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
                      v-model="patientForm.isRefuseSms"
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
                  :name="patientForm.nextOfKin1Name"
                  :relationshipId="patientForm.nextOfKin1RelationshipId"
                  :contactNumber="patientForm.nextOfKin1ContactNumber"
                  :smsNumber="patientForm.nextOfKin1SmsNumber"
                  :remarks="patientForm.nextOfKin1Remark"
                  @update:name="val => (patientForm.nextOfKin1Name = val)"
                  @update:relationshipId="val => (patientForm.nextOfKin1RelationshipId = val)"
                  @update:contactNumber="val => (patientForm.nextOfKin1ContactNumber = val)"
                  @update:smsNumber="val => (patientForm.nextOfKin1SmsNumber = val)"
                  @update:remarks="val => (patientForm.nextOfKin1Remark = val)"
                  required
                />

                <next-of-kin-form
                  form-number="2"
                  :relationships="relationships"
                  :fetching-options="fetchingOptions"
                  :name="patientForm.nextOfKin2Name"
                  :relationshipId="patientForm.nextOfKin2RelationshipId"
                  :contactNumber="patientForm.nextOfKin2ContactNumber"
                  :smsNumber="patientForm.nextOfKin2SmsNumber"
                  :remarks="patientForm.nextOfKin2Remark"
                  @update:name="val => (patientForm.nextOfKin2Name = val)"
                  @update:relationshipId="val => (patientForm.nextOfKin2RelationshipId = val)"
                  @update:contactNumber="val => (patientForm.nextOfKin2ContactNumber = val)"
                  @update:smsNumber="val => (patientForm.nextOfKin2SmsNumber = val)"
                  @update:remarks="val => (patientForm.nextOfKin2Remark = val)"
                />

                <next-of-kin-form
                  form-number="3"
                  :relationships="relationships"
                  :fetching-options="fetchingOptions"
                  :name="patientForm.nextOfKin2Name"
                  :relationshipId="patientForm.nextOfKin2RelationshipId"
                  :contactNumber="patientForm.nextOfKin2ContactNumber"
                  :smsNumber="patientForm.nextOfKin2SmsNumber"
                  :remarks="patientForm.nextOfKin2Remark"
                  @update:name="val => (patientForm.nextOfKin3Name = val)"
                  @update:relationshipId="val => (patientForm.nextOfKin3RelationshipId = val)"
                  @update:contactNumber="val => (patientForm.nextOfKin3ContactNumber = val)"
                  @update:smsNumber="val => (patientForm.nextOfKin3SmsNumber = val)"
                  @update:remarks="val => (patientForm.nextOfKin3Remark = val)"
                />
              </div>
            </div>

            <div class="form-section">
              <div class="card-header">
                <div class="form-section-title">Special Status</div>
              </div>
              <div class="form-content split-columns">
                <v-checkbox
                  v-model="patientForm.isSensitive"
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
                  class="m-checkbox caption-1"
                  label="Persona Non-Grata"
                  color="#F3BC51"
                  hide-details
                  disabled
                />

                <v-textarea
                  v-model="patientForm.outstandingBillReason"
                  :filled="!patientForm.isOutstandingBill"
                  :disabled="!patientForm.isOutstandingBill"
                  style="border-radius: 7px"
                  outlined
                  hide-details
                  no-resize
                  placeholder="Reason"
                />

                <v-textarea
                  v-model="patientForm.personaNonGrataReason"
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
        @on-save="saveAddress"
        @on-close="addressFormDialogShowing = false"
      />

      <v-divider class="divider" />

      <v-card-actions style="justify-content: flex-end">
        <v-btn
          class="no-cap"
          color="primary"
          rounded
          outlined
          :disabled="isSubmitting"
          @click="confirmCancel"
          >Cancel</v-btn
        >

        <v-btn
          class="no-cap"
          color="primary"
          rounded
          :loading="isSubmitting"
          :disabled="isSubmitting"
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
.selection-text-group {
  display: grid;
  grid-template-rows: 1fr;
  gap: 4px;
}
.doc-num {
  grid-template-columns: 20% 1fr;
}
.mobile-num {
  grid-template-columns: 30% 1fr;
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

.textarea-no-spacing {
  padding: 0 12px;
  margin-top: 0;
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
