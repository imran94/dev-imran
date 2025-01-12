<script>
import {
  fixedDocumentTypes,
  fixedCountryCodes,
  fixedNationalities,
  fixedOccupations,
  fixedRelationships
} from '@/utils/formSelections'
import { BASE_URL } from '@/utils/network'

export default {
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
    isMarketingPurpose: true,
    isCancelSubscription: true,
    smsLanguage: '',
    isRefuseSms: true,
    nextOfKin1Name: '',
    nextOfKin1RelationshipId: 0,
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
    isSensitive: true,
    isOutstandingBill: true,
    outstandingBillReason: '',
    isPersonaNonGrata: true,
    personaNonGrataReason: ''
  }),
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
        resArr.map((r) => r.json())
      )

      this.documentTypes = documentTypes
      this.nationalities = nationalities
      this.occupations = occupations
      this.relationships = relationships
      this.countryCodes = countryCodes

      this.fetchingOptions = false
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
          text
          icon
          @click="$emit('on-close-button-clicked')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form class="form">
          <div class="form-section">
            <div class="card-header">
              <div class="form-section-title">Personal Information</div>
            </div>
            <div class="form-content split-columns">
              <div class="doc-num-input-control">
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
                <v-text-field
                  hide-details
                  outlined
                  dense
                  clearable
                  placeholder="DD/MM/YYYY"
                />
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
            <div class="form-content"></div>
          </div>

          <div class="form-section">
            <div class="card-header">
              <div class="form-section-title">Special Status</div>
            </div>
            <div class="form-content"></div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
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

.alert-text {
  color: var(--alert);
}

.card-header {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.doc-num-input-control {
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
