<script>
import { formatDate, formatDatetime } from '../../utils/formatters'

export default {
  props: {
    patients: Array,
    selectedPatient: Object,
    loading: Boolean
  },
  emits: ['on-patient-selected'],
  methods: {
    selectPatient(patient) {
      this.$emit('on-patient-selected', patient)
    },
    getDateString(timestamp) {
      return formatDate(timestamp)
    },
    getDateTimeString(timestamp) {
      return formatDatetime(timestamp)
    },
    getAgeString(age) {
      return age.replace('y', 'Y')
    }
  }
}
</script>

<template>
  <div
    class="patients-list"
    :class="{ 'full-size': !selectedPatient }"
  >
    <v-skeleton-loader
      v-show="loading"
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
        <div
          class="inline-row"
          v-show="patient.comingAppointment > 0"
        >
          <div class="text-primary callout">Appointments</div>
          <v-chip
            style="padding: 4px !important"
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

        <div>{{ patient.sex }}</div>
        <div>{{ getDateString(patient.dateOfBirth) }} {{ getAgeString(patient.ageYear) }}</div>
        <div>{{ patient.documentNumber }}</div>
        <div>{{ patient.mobileNumber }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patients-list,
.patient-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patients-list {
  margin: 4px 8px;
  gap: 1em;
}

.full-size {
  grid-column: 1/-1;
}

.patient-row {
  width: 100%;

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

.vip-label {
  padding: 4px 8px;
  border-radius: 7px;
}

.patient-general-info-2 {
  width: 100%;
  background-color: var(--pale-grey);
  padding: 4px;

  display: grid;
  grid-template-columns: 15% repeat(3, 1fr);
  /* grid-template-rows: 16px 19px; */
  gap: 4px;
}

@media (width >= 1024px) {
  /* .patients-list {
    max-width: 70%;
  } */

  .patient-general-info-2 {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
