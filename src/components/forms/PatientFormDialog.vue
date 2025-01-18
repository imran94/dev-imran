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

let backupPatientForm = blankPatient()

export default {
  components: { NextOfKinForm, AddressFormDialog },
  props: {
    showDialog: Boolean,
    patientId: Number
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
      minDobDate: '1900-01-01',
      maxDobDate: new Date().toISOString(),

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
      requiredRule: v => !!v,

      // Form Data
      valid: true,
      patientForm: blankPatient(),
      isEditing: false,
      isSubmitting: false,
      isLoadingData: false
    }
  },
  computed: {
    formattedDate() {
      if (!this.patientForm.dateOfBirth) return null

      const [year, month, day] = this.patientForm.dateOfBirth.substring(0, 10).split('-')
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
    },
    isFieldDisabled() {
      return (this.patientId && !this.isEditing) || this.isSubmitting || this.isLoadingData
    },
    isInputFieldLoading() {
      return this.isSubmitting || this.isLoadingData
    },
    isSelectionFieldLoading() {
      return this.isSubmitting || this.isLoadingData || this.isFetchingOptions
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
    async handleFormSubmission() {
      this.isSubmitting = true

      this.$refs.form.validate()
      if (!this.valid) {
        this.isSubmitting = false
        return
      }

      let endpoint = 'Patients'
      if (this.patientId) {
        endpoint += '/' + this.patientId
      }
      const url = new URL(endpoint, BASE_URL)
      const method = this.patientId ? 'PUT' : 'POST'
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          method: method,
          body: JSON.stringify(this.patientForm)
        })
        console.log(`${method} res`, res)
        const data = await res.json()
        console.log(`${method} data`, data)
      } catch (err) {
        console.error(err)
      }

      this.isSubmitting = false
    },
    async fetchPatient() {
      this.isLoadingData = true

      const url = new URL(`Patients/${this.patientId}`, BASE_URL)
      try {
        const res = await fetch(url)
        console.log('fetchPatientById res', res)
        this.patientForm = await res.json()
        backupPatientForm = { ...this.patientForm }

        if (this.patientForm.dateOfBirth) {
          this.userDOB = this.formattedDate
        }
        // console.log('fetchPatientById data', data)
      } catch (e) {
        console.err('Error occurred while fetching patient by id', e)
      }

      this.isLoadingData = false
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
    promptCancelConfirmation() {
      if (this.patientId && this.isEditing) {
        this.cancellationDialog = true
        return
      }

      this.closeFormDialog()
    },
    cancelEdit() {
      if (!this.patientId) {
        this.closeFormDialog()
        return
      }

      this.patientForm = {
        ...backupPatientForm
      }
      this.isEditing = false
      this.cancellationDialog = false
    },
    closeFormDialog() {
      this.cancellationDialog = false
      this.$emit('on-close')
    }
  },
  watch: {
    patientId(newId, oldId) {
      this.isEditing = false

      if (!newId) {
        this.patientForm = blankPatient()
        this.userDOB = ''
        return
      }

      this.fetchPatient()
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

      <v-divider class="divider-top" />

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          class="form"
          lazy-validation
        >
          <div class="form-column">
            <div class="form-section">
              <div class="form-header">
                <div class="form-section-title">Personal Information</div>
              </div>
              <div class="form-content split-columns">
                <div class="colspan-full">
                  <v-label for="doc-num">Document No.<span class="alert-text">*</span></v-label>
                  <div class="selection-text-group doc-num">
                    <v-select
                      v-model.trim="patientForm.documentTypeId"
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
                      :loading="isSelectionFieldLoading"
                      :disabled="isFieldDisabled"
                      :filled="isSelectionFieldLoading || isFieldDisabled"
                    />
                    <v-text-field
                      v-model.trim="patientForm.documentNumber"
                      :rules="[requiredRule]"
                      id="doc-num"
                      hide-details
                      outlined
                      dense
                      clearable
                      placeholder="Document No."
                      :loading="isInputFieldLoading"
                      :disabled="isFieldDisabled"
                      :filled="isFieldDisabled"
                    />
                  </div>
                </div>
                <div>
                  <v-label>Surname<span class="alert-text">*</span></v-label>
                  <v-text-field
                    v-model.trim="patientForm.surname"
                    :rules="[requiredRule]"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Surname"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
                  />
                </div>
                <div>
                  <v-label>Given Name<span class="alert-text">*</span></v-label>
                  <v-text-field
                    v-model.trim="patientForm.givenName"
                    :rules="[requiredRule]"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Given Name"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
                  />
                </div>
                <div>
                  <v-label>中文姓名</v-label>
                  <v-text-field
                    v-model.trim="patientForm.chineseName"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="中文姓名"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
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
                        hide-details
                        outlined
                        dense
                        append-icon="mdi-calendar"
                        placeholder="DD/MM/YYYY"
                        :rules="dobRules"
                        :loading="isInputFieldLoading"
                        :disabled="isFieldDisabled"
                        :filled="isFieldDisabled"
                        @input="handleDOBInput"
                        @keydown="filterDateInput"
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
                    v-model.trim="patientForm.occupation"
                    :items="occupations"
                    item-text="description"
                    placeholder="Occupation"
                    :loading="isSelectionFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isSelectionFieldLoading || isFieldDisabled"
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
                    v-model.trim="patientForm.nationalityId"
                    :items="nationalities"
                    item-text="description"
                    item-value="id"
                    :menu-props="{
                      bottom: true,
                      offsetY: true
                    }"
                    :rules="[requiredRule]"
                    :loading="isSelectionFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isSelectionFieldLoading || isFieldDisabled"
                  />
                </div>
                <div>
                  <v-label>PR No.</v-label>
                  <v-text-field
                    v-model.trim="patientForm.prNumber"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="PR No."
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
                  />
                </div>
                <div>
                  <v-label>Mobile No.<span class="alert-text">*</span></v-label>
                  <div class="selection-text-group mobile-num">
                    <v-select
                      v-model.trim="patientForm.mobileCountryCodeId"
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
                      :loading="isSelectionFieldLoading"
                      :disabled="isFieldDisabled"
                      :filled="isSelectionFieldLoading || isFieldDisabled"
                    />
                    <v-text-field
                      v-model.trim="patientForm.mobileNumber"
                      @keydown="filterNumInput"
                      hide-details
                      outlined
                      dense
                      clearable
                      placeholder="Mobile No."
                      :rules="[requiredRule]"
                      :loading="isInputFieldLoading"
                      :disabled="isFieldDisabled"
                      :filled="isFieldDisabled"
                    />
                  </div>
                </div>
                <div>
                  <v-label>Tel No. (Home)</v-label>
                  <v-text-field
                    v-model.trim="patientForm.homeTelNo"
                    @keydown="filterNumInput"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Tel No. (Home)"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-header">
                <div class="form-section-title">Address</div>
                <v-btn
                  small
                  color="primary"
                  class="white--text caption-2 no-cap"
                  rounded
                  :disabled="isFieldDisabled"
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
                    v-model.trim="patientForm.remark"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Remarks"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
                  />
                </div>

                <div>
                  <v-label>Email</v-label>
                  <v-text-field
                    v-model.trim="patientForm.email"
                    :rules="[emailRule]"
                    hide-details
                    outlined
                    dense
                    clearable
                    placeholder="Email"
                    :loading="isInputFieldLoading"
                    :disabled="isFieldDisabled"
                    :filled="isFieldDisabled"
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
                      class="m-checkbox caption-1"
                      :class="{ bold: !isFieldDisabled }"
                      label="Marketing purpose"
                      color="#F3BC51"
                      hide-details
                      :disabled="isFieldDisabled"
                    />
                    <v-checkbox
                      v-model="patientForm.isCancelSubscription"
                      class="m-checkbox caption-1"
                      :class="{ bold: !isFieldDisabled }"
                      label="Cancel subscription"
                      color="#F3BC51"
                      hide-details
                      :disabled="isFieldDisabled"
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
                      :color="resolveChoiceButtonColor(patientForm.smsLanguage, 'Eng')"
                      :disabled="isFieldDisabled"
                      @click="patientForm.smsLanguage = 'Eng'"
                    >
                      Eng
                    </v-btn>

                    <v-btn
                      x-small
                      rounded
                      style="font-weight: 700"
                      class="caption-2 no-cap"
                      :outlined="patientForm.smsLanguage !== 'Chi'"
                      :color="resolveChoiceButtonColor(patientForm.smsLanguage, 'Chi')"
                      :disabled="isFieldDisabled"
                      @click="patientForm.smsLanguage = 'Chi'"
                    >
                      Chi
                    </v-btn>
                    <v-checkbox
                      v-model="patientForm.isRefuseSms"
                      class="m-checkbox caption-1"
                      :class="{ bold: !isFieldDisabled }"
                      label="Refuse SMS"
                      color="#F3BC51"
                      hide-details
                      :disabled="isFieldDisabled"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-column">
            <div class="form-section">
              <div class="form-header">
                <div class="form-section-title">Next of Kin</div>
              </div>
              <div class="form-content next-of-kin-section">
                <next-of-kin-form
                  form-number="1"
                  :relationships="relationships"
                  :name="patientForm.nextOfKin1Name"
                  :relationshipId="patientForm.nextOfKin1RelationshipId"
                  :contactNumber="patientForm.nextOfKin1ContactNumber"
                  :smsNumber="patientForm.nextOfKin1SmsNumber"
                  :remarks="patientForm.nextOfKin1Remark"
                  :disabled="isFieldDisabled"
                  :loading="isInputFieldLoading"
                  :selection-loading="isSelectionFieldLoading"
                  @update:name="val => (patientForm.nextOfKin1Name = val.trim())"
                  @update:relationshipId="val => (patientForm.nextOfKin1RelationshipId = val.trim())"
                  @update:contactNumber="val => (patientForm.nextOfKin1ContactNumber = val.trim())"
                  @update:smsNumber="val => (patientForm.nextOfKin1SmsNumber = val.trim())"
                  @update:remarks="val => (patientForm.nextOfKin1Remark = val.trim())"
                  required
                />

                <next-of-kin-form
                  form-number="2"
                  :relationships="relationships"
                  :name="patientForm.nextOfKin2Name"
                  :relationshipId="patientForm.nextOfKin2RelationshipId"
                  :contactNumber="patientForm.nextOfKin2ContactNumber"
                  :smsNumber="patientForm.nextOfKin2SmsNumber"
                  :remarks="patientForm.nextOfKin2Remark"
                  :disabled="isFieldDisabled"
                  :loading="isInputFieldLoading"
                  :selection-loading="isSelectionFieldLoading"
                  @update:name="val => (patientForm.nextOfKin2Name = val)"
                  @update:relationshipId="val => (patientForm.nextOfKin2RelationshipId = val)"
                  @update:contactNumber="val => (patientForm.nextOfKin2ContactNumber = val)"
                  @update:smsNumber="val => (patientForm.nextOfKin2SmsNumber = val)"
                  @update:remarks="val => (patientForm.nextOfKin2Remark = val)"
                />

                <next-of-kin-form
                  form-number="3"
                  :relationships="relationships"
                  :name="patientForm.nextOfKin3Name"
                  :relationshipId="patientForm.nextOfKin3RelationshipId"
                  :contactNumber="patientForm.nextOfKin3ContactNumber"
                  :smsNumber="patientForm.nextOfKin3SmsNumber"
                  :remarks="patientForm.nextOfKin3Remark"
                  :disabled="isFieldDisabled"
                  :loading="isInputFieldLoading"
                  :selection-loading="isSelectionFieldLoading"
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
                  class="m-checkbox caption-1 colspan-full"
                  :class="{ bold: !isFieldDisabled }"
                  label="Sensitive Patient"
                  color="#F3BC51"
                  hide-details
                  :disabled="isFieldDisabled"
                />

                <v-checkbox
                  v-model="patientForm.isOutstandingBill"
                  class="m-checkbox caption-1"
                  :class="{ bold: !isFieldDisabled }"
                  label="Outstanding Bill"
                  color="#F3BC51"
                  hide-details
                  :disabled="isFieldDisabled"
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
                  filled
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

      <v-divider class="divider-bottom" />

      <v-card-actions class="card-buttons-grid">
        <v-btn
          class="custom-btn-padding-small no-cap"
          v-show="patientId && !isEditing"
          color="warning"
          rounded
          :disabled="isSubmitting"
          @click="isEditing = true"
        >
          <v-icon
            left
            dark
          >
            mdi-content-save-outline
          </v-icon>
          Edit
        </v-btn>

        <div class="inline-btn-group">
          <v-btn
            class="custom-btn-padding no-cap"
            color="primary"
            rounded
            outlined
            :disabled="isSubmitting"
            @click="promptCancelConfirmation"
          >
            Cancel
          </v-btn>

          <v-btn
            class="custom-btn-padding no-cap"
            v-show="!patientId || (patientId && isEditing)"
            color="primary"
            rounded
            :loading="isSubmitting"
            :disabled="isSubmitting || (patientId && !isEditing)"
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
        </div>
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
              >Back</v-btn
            >

            <v-btn
              class="no-cap"
              color="primary"
              rounded
              @click="cancelEdit"
            >
              <v-icon
                left
                dark
              >
                mdi-check
              </v-icon>
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.divider-top {
  margin: 12px;
}

.divider-bottom {
  margin-top: 12px;
  margin-bottom: 4px;
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

.card-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  width: 100%;
}

.card-buttons-grid > * {
  width: fit-content;
}

.inline-btn-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-self: end;
  gap: 8px;
  grid-column: 2;
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
