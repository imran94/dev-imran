<script>
import { formatDate } from '@/utils/formatters'
import { formatDatetime } from '../../utils/formatters'

export default {
  props: {
    details: Object,
    loading: Boolean
  },
  emits: ['on-patient-details-selected'],
  methods: {
    getDateString(timestamp) {
      return formatDate(timestamp)
    },
    getDateTimeString(timestamp) {
      return formatDatetime(timestamp)
    }
  }
}
</script>

<template>
  <div class="patient-details">
    <div class="patient-details-buttons">
      <v-btn
        color="primary"
        class="white--text caption-2 no-cap custom-btn-padding-small"
        rounded
        small
        :disabled="loading"
        @click="$emit('on-patient-details-selected')"
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
        class="white--text caption-2 no-cap custom-btn-padding-small"
        rounded
        small
        :disabled="loading"
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
        <div>{{ details.membershipID }}</div>
      </div>
      <div class="patient-details-content">
        <div class="key">Class</div>
        <div class="value">
          {{ details.class }}
        </div>
        <div class="key">Points Remain</div>
        <div class="value">
          {{ details.pointsRemain?.toLocaleString() ?? 0 }}
        </div>
        <div class="key">Expired Date</div>
        <div
          class="value"
          v-if="details.expiredDate"
        >
          {{ getDateString(details.expiredDate) }}
        </div>
      </div>
    </div>

    <div class="patient-details-group">
      <div class="spaced-row">
        <div class="subheadline text-primary">Prepaid Item</div>
        <div class="caption-1">
          {{ details.prepaidItems?.length ?? 0 }}
        </div>
      </div>
      <div class="patient-details-header">
        <div class="caption-2">Item Name</div>
        <div class="caption-2">Invoice No.</div>
      </div>
      <template v-if="details.prepaidItems">
        <div
          class="patient-details-content"
          v-for="(item, index) in details.prepaidItems"
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
          {{ details.numberOfVisits?.length ?? 0 }}
        </div>
      </div>
      <template v-if="details.numberOfVisits">
        <div
          class="patient-details-content"
          v-for="(visit, index) in details.numberOfVisits"
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
          {{ details.nextAppointments?.length ?? 0 }}
        </div>
      </div>
      <template v-if="details.nextAppointments">
        <div
          class="patient-details-content"
          v-for="appointment in details.nextAppointments"
          :key="appointment.appointmentAt"
        >
          <div class="key">Date Time</div>
          <div class="value one-line">
            {{ getDateTimeString(appointment.appointmentAt) }}
          </div>
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
            :disabled="loading"
            >View Schedule</v-btn
          >
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.patient-details {
  /* width: 400px; */
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

@media (width <= 1024px) {
  /* .patients-list {
    max-width: 70%;
  } */
  /* .patient-details {
    max-width: 320px;
  } */
}
</style>
