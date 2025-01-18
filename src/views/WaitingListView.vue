<template>
  <div class="main">
    <div class="top-bar">
      <div class="title-1">Patient</div>

      <v-btn
        color="primary"
        class="white--text footnote no-cap custom-btn-padding"
        rounded
        @click="handleCreatePatientClick"
      >
        <v-icon
          left
          dark
        >
          mdi-cloud-upload
        </v-icon>
        Create Patient
      </v-btn>
    </div>

    <div class="search-bar">
      <v-select
        class="search-select"
        v-model="selectedSearchFilter"
        :items="searchFilters"
        dense
        outlined
        height="36"
      />

      <v-text-field
        class="search-text-field"
        width="100%"
        v-model="searchText"
        placeholder="Search Patient"
        append-icon="mdi-map-marker"
        dense
        outlined
        clearable
        :loading="searching"
        @keypress.enter="searchPatients"
      />
    </div>

    <div class="patients-section">
      <patient-list
        :patients="patients"
        :selected-patient="selectedPatient"
        :loading="searching"
        @on-patient-selected="selectPatient"
      />

      <patient-details
        v-if="patientAdditionalInfo"
        :details="patientAdditionalInfo"
        :loading="isLoadingPatientDetails"
        @on-patient-details-selected="handlePatientDetailsSelection"
      />
    </div>
    <patient-form-dialog
      :show-dialog="patientFormDialog"
      :patient-id="selectedPatientId"
      @on-close="patientFormDialog = false"
    />
  </div>
</template>

<script>
import { BASE_URL } from '@/utils/network'
import { patients } from '@/utils/patients'
import { additionalInfo } from '@/utils/patients'
import PatientList from '../components/waiting-list/PatientList.vue'
import { formatDate } from '../utils/formatters'
import PatientDetails from '../components/waiting-list/PatientDetails.vue'
import PatientFormDialog from '../components/forms/PatientFormDialog.vue'

export default {
  components: {
    PatientList,
    PatientDetails,
    PatientFormDialog
  },
  data: () => ({
    searchFilters: [
      { text: 'Eng. Name', value: 'EnglishName' },
      { text: 'Chi. Name', value: 'ChineseName' },
      { text: 'Doc. No.', value: 'DocumentNumber' }
    ],
    selectedSearchFilter: 'EnglishName',
    searchText: '',
    searching: false,
    patients: [],
    selectedPatient: null,
    selectedPatientId: null,
    patientAdditionalInfo: null,
    patientFormDialog: false,
    isLoadingPatientDetails: false
  }),
  methods: {
    toggleMenu() {},
    async searchPatients() {
      this.patients = []
      this.selectedPatient = null
      this.patientAdditionalInfo = null
      this.searching = true

      const keyword = this.searchText.trim()

      const url = new URL('Patients', BASE_URL)
      url.searchParams.append('FilterBy', this.selectedSearchFilter)
      url.searchParams.append('Keyword', keyword)

      const res = await fetch(url)
      const data = await res.json()
      this.patients = data.items

      this.searching = false
    },
    getDateString(timestamp) {
      return formatDate(timestamp)
    },
    getDateTimeString(timestamp) {
      return dateTimeFormatter.format(new Date(timestamp))
    },
    async selectPatient(patient) {
      if (patient.id === this.selectedPatient?.id) {
        return
      }

      this.isLoadingPatientDetails = true
      this.selectedPatient = patient

      try {
        const url = new URL(`Patients/${patient.id}/AdditionalInfo`, BASE_URL)
        const res = await fetch(url)
        const data = await res.json()
        this.patientAdditionalInfo = data
      } catch (e) {
        console.error('Error occurred while loading patient details', e)
      }
      this.isLoadingPatientDetails = false
    },
    handlePatientDetailsSelection() {
      if (!this.selectedPatient) {
        return
      }

      this.selectedPatientId = this.selectedPatient.id
      this.patientFormDialog = true
    },
    handleCreatePatientClick() {
      this.selectedPatientId = null
      this.patientFormDialog = true
    }
  },
  computed: {}
}
</script>

<style>
.v-icon,
.v-select__selection {
  align-self: center;
  height: 100%;
}
</style>

<style scoped>
.main {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 1em;
}

.top-bar {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  width: 100%;

  display: grid;
  grid-template-columns: 170px 1fr;
  align-items: center;
  gap: 0.5rem;

  max-height: 36px;
}

.patients-section {
  display: grid;
  grid-template-columns: 1fr 280px;
  grid-template-rows: 100%;

  /* display: flex;
  flex-direction: row; */
  column-gap: 0.25rem;

  height: 100%;

  /* max-width: 75%; */
}

.text-primary {
  color: var(--primary);
}

@media (width >= 1024px) {
  .patients-section {
    grid-template-columns: 1fr 25%;
  }
}
</style>
