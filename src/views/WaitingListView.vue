<template>
  <div class="main">
    <div class="top-bar">
      <h3>Patient</h3>
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        rounded
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
        v-model="selectedSearchFilter"
        :items="searchFilters"
        dense
        outlined
        height="36"
      />

      <v-text-field
        v-model="searchText"
        placeholder="Search Patient"
        append-icon="mdi-map-marker"
        dense
        outlined
        :loading="isSearchingPatients"
        @keypress.enter="searchPatients"
      />
    </div>

    <div class="patients-section">
      <div class="patients-list">
        <v-skeleton-loader
          v-show="isSearchingPatients"
          type="table-heading, list-item, table-heading, list-item, table-heading, list-item, table-heading, list-item, table-heading, list-item, table-heading, list-item"
        />
        <div
          class="patient-row"
          v-for="patient in patients"
          :key="patient.id"
          :class="{ 'patient-row-selected': patient.id === selectedPatient?.id }"
          @click="selectPatient(patient)"
        >
          <div class="patient-general-info spaced-row">
            <div class="inline-row">
              <v-chip
                v-if="patient.isVIP"
                class="vip-label"
                color="#FFC553"
                text-color="white"
              >
                VIP
              </v-chip>
              <div class="subheadline patient-name">
                {{ patient.englishName }} <span v-if="patient.chineseName">({{ patient.chineseName }})</span>
              </div>
            </div>
            <div class="inline-row">
              <div class="text-primary callout">Appointments</div>
              <v-chip
                style="padding: 4px"
                label
                color="primary"
                text-color="white"
              >
                {{ (patient.comingAppointment < 10 ? '0' : '') + patient.comingAppointment }}
              </v-chip>
            </div>
          </div>
          <div class="patient-general-info-2">
            <div class="caption-2">Sex</div>
            <div class="caption-2">Date of Birth</div>
            <div class="caption-2">HKID / Document No.</div>
            <div class="caption-2">Contact No.</div>

            <div class="one-line">{{ patient.sex }}</div>
            <div class="one-line">{{ getDateString(patient.dateOfBirth) }} {{ getAgeString(patient.ageYear) }}</div>
            <div class="one-line">{{ patient.documentNumber }}</div>
            <div class="one-line">{{ patient.mobileNumber }}</div>
          </div>
        </div>
      </div>

      <div
        class="patient-details"
        v-if="patientAdditionalInfo"
      >
        <div class="patient-details-buttons">
          <v-btn
            color="primary"
            class="white--text caption-2 no-cap"
            rounded
            small
          >
            <v-icon
              left
              dark
            >
              mdi-cloud-upload
            </v-icon>
            Patient Details
          </v-btn>

          <v-btn
            color="primary"
            class="white--text caption-2 no-cap"
            rounded
            small
          >
            <v-icon
              left
              dark
            >
              mdi-cloud-upload
            </v-icon>
            Take Attendance
          </v-btn>
        </div>

        <div class="patient-details-group">
          <div class="spaced-row">
            <div class="subheadline text-primary">Membership ID</div>
            <div>{{ patientAdditionalInfo.membershipID }}</div>
          </div>
          <div class="patient-details-content">
            <div class="key">Class</div>
            <div class="value">
              {{ patientAdditionalInfo.class }}
            </div>
            <div class="key">Points Remain</div>
            <div class="value">
              {{ patientAdditionalInfo.pointsRemain?.toLocaleString() ?? 0 }}
            </div>
            <div class="key">Expired Date</div>
            <div
              class="value"
              v-if="patientAdditionalInfo.expiredDate"
            >
              {{ getDateString(patientAdditionalInfo.expiredDate) }}
            </div>
          </div>
        </div>

        <div class="patient-details-group">
          <div class="spaced-row">
            <div class="subheadline text-primary">Prepaid Item</div>
            <div class="caption-1">
              {{ patientAdditionalInfo.prepaidItems?.length ?? 0 }}
            </div>
          </div>
          <div class="patient-details-header">
            <div class="caption-2">Item Name</div>
            <div class="caption-2">Invoice No.</div>
          </div>
          <template v-if="patientAdditionalInfo.prepaidItems">
            <div
              class="patient-details-content"
              v-for="(item, index) in patientAdditionalInfo.prepaidItems"
              :key="index"
            >
              <div class="key">{{ item.itemName }}</div>
              <div class="value one-line">{{ item.invoiceNo }}</div>
            </div>
          </template>
        </div>

        <div class="patient-details-group">
          <div class="spaced-row">
            <div class="subheadline text-primary">No. of visit</div>
            <div class="caption-1">
              {{ patientAdditionalInfo.numberOfVisits?.length ?? 0 }}
            </div>
          </div>
          <template v-if="patientAdditionalInfo.numberOfVisits">
            <div
              class="patient-details-content"
              v-for="(visit, index) in patientAdditionalInfo.numberOfVisits"
              :key="index"
            >
              <div class="key">Last Plan / Items</div>
              <div
                class="value one-line"
                v-for="(item, index) in visit.itemNames"
                :key="index"
              >
                {{ item }}
              </div>
              <div class="key">Invoice No.</div>
              <div class="value one-line">{{ visit.invoiceNo }}</div>
            </div>
          </template>
        </div>

        <div class="patient-details-group">
          <div class="spaced-row">
            <div class="subheadline text-primary">Next Appointment</div>
            <div class="caption-1">
              {{ patientAdditionalInfo.nextAppointments?.length ?? 0 }}
            </div>
          </div>
          <template v-if="patientAdditionalInfo.nextAppointments">
            <div
              class="patient-details-content"
              v-for="(appointment, index) in patientAdditionalInfo.nextAppointments"
              :key="appointment.appointmentAt"
            >
              <div class="key">Date Time</div>
              <div class="value one-line">{{ getDateTimeString(appointment.appointmentAt) }}</div>
              <div class="key">Plan / Items</div>
              <div
                class="value one-line"
                v-for="(item, index) in appointment.itemNames"
                :key="index"
              >
                {{ item }}
              </div>
              <v-btn
                small
                outlined
                rounded
                max-width="107"
                color="primary"
                class="no-cap caption-2 btn"
                >View Schedule</v-btn
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/utils/network'
import { patients } from '@/utils/patients'
import { additionalInfo } from '../utils/patients'

const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}
const dateFormatter = new Intl.DateTimeFormat('en-GB', options)

options.hour = '2-digit'
options.minute = '2-digit'
const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', options)

export default {
  data: () => ({
    searchFilters: [
      { text: 'Eng. Name', value: 'EnglishName' },
      { text: 'Chi. Name', value: 'ChineseName' },
      { text: 'Doc. Number', value: 'DocumentNumber' }
    ],
    selectedSearchFilter: 'EnglishName',
    searchText: '',
    isSearchingPatients: false,
    patients: [],
    selectedPatient: null,
    patientAdditionalInfo: null
  }),
  methods: {
    toggleMenu() {},
    async searchPatients() {
      this.patients = []
      this.patientAdditionalInfo = false
      this.isSearchingPatients = true

      const keyword = this.searchText.trim()
      //   if (patientName.length === 0) {
      //     console.log('nope')
      //     return
      //   }

      const url = new URL('Patients', BASE_URL)
      url.searchParams.append('FilterBy', this.selectedSearchFilter)
      url.searchParams.append('Keyword', keyword)

      const res = await fetch(url)
      const data = await res.json()
      this.patients = data.items

      this.isSearchingPatients = false
    },
    getDateString(timestamp) {
      return dateFormatter.format(new Date(timestamp))
    },
    getDateTimeString(timestamp) {
      return dateTimeFormatter.format(new Date(timestamp))
    },
    getAgeString(age) {
      return age.replace('y', 'Y')
    },
    async selectPatient(patient) {
      if (patient.id === this.selectedPatient?.id) {
        return
      }

      this.selectedPatient = patient

      const url = new URL(`Patients/${patient.id}/AdditionalInfo`, BASE_URL)
      console.log(url.href)
      const res = await fetch(url)
      const data = await res.json()
      this.patientAdditionalInfo = data
    }
  }
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
  grid-template-columns: 15% 1fr;
  align-items: center;
  gap: 0.5rem;

  max-height: 36px;
}

.patients-section {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;

  height: 100%;

  /* max-width: 75%; */
}

.patients-list,
.patient-row {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patients-list {
  margin: 4px 8px;
  gap: 1em;
}

.patient-row {
  padding: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 1.95px 0;
  cursor: pointer;
}

.patient-row:hover,
.patient-row:active {
  background-color: #fcfcfc;
}

.patient-row-selected {
  border: 2px solid var(--primary);
  border-radius: 7px;
}

.patient-general-info {
  padding: 6.5px 0;
}

.patient-name {
}

.inline-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.spaced-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
}

.vip-label {
  padding: 4px 8px;
  border-radius: 7px;
}

.text-primary {
  color: var(--primary);
}

.patient-general-info-2 {
  width: 100%;
  background-color: var(--pale-grey);
  padding: 4px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* grid-template-rows: 16px 19px; */
  row-gap: 4px;
}

.patient-details {
  width: 400px;
  height: 100%;
  padding: 8px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  border-left: 2px solid var(--silver);
  background-color: var(--pale-grey);
}

.patient-details-buttons {
  width: 100%;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
}

.patient-details-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patient-details-header,
.patient-details-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 30px;
}

.patient-details-content {
  background-color: white;

  border: 1px solid var(--text-secondary);
  border-radius: 7px;
  column-gap: 0.25rem;
  row-gap: 12px;
  padding: 12px;

  font-family: 'Lato';
  font-size: 16px;
  font-weight: 400;
  line-height: 19.2px;
  color: var(--text-primary);
}
.patient-details-content .key {
  grid-column: 1;
}
.patient-details-content .value {
  grid-column: 2;
}
.patient-details-content .btn {
  grid-column: 1/-1;
}

.one-line {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

@media (width <= 1024px) {
  .patients-list {
    max-width: 70%;
  }
}
</style>
