<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container ma-0 row >
    <v-layout>
      <v-flex>
        <h1 class="headline font-weight-bold mb-3">
          Inspection Summaries
        </h1>
      </v-flex>
      <v-flex shrink>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="primary"
          @click="load"
          v-if="!loaded"
        >
          Load Summary
        </v-btn>
        <v-btn
          color="primary"
          v-else
          @click="convertFile"
        >
          Download Summary
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout mt-2 justify-center v-if="loaded">
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="items"
          :rows-per-page-items="[50,100]"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.deviceNumber }}</td>
            <td class="text-xs-right">{{ props.item.centerName }}</td>
            <td class="text-xs-right">{{ props.item.startTime }}</td>
            <td class="text-xs-right">{{ props.item.subjectGender }}</td>
            <td class="text-xs-right">{{ props.item.subjectBirth }}</td>
            <td class="text-xs-right">{{ props.item.totalEventCountSleep }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const electron = require('electron').remote
const dialog = electron.dialog
const app = electron.app
const fs = require('fs')
export default {
  name: 'Summaries',
  data () {
    return {
      loader: null,
      loading: false,
      headers: [
        { text: 'Device Number', align: 'center', value: 'deviceNumber' },
        { text: 'Center Name', align: 'center', value: 'centerName' },
        { text: 'Start Datetime', align: 'center', value: 'startTime' },
        { text: 'Gender', align: 'center', value: 'subjectGender' },
        { text: 'Birthday', align: 'center', value: 'subjectBirth' },
        { text: 'Event Count', align: 'center', value: 'totalEventCount' }
      ],
      items: [],
      csvHeaders: [
        'Center_name ',
        'Status',
        'Device_number',
        'Subject_gender',
        'Subject_height',
        'Subject_weight',
        'Subject_birth',
        'Start_Date',
        'Start_time',
        'End_Date',
        'End_time',
        'ECG_event_total_all',
        'ECG_event_total_all_sleep',
        'ECG_event_total_all_non_sleep',
        'ECG_event_1_SinBrady_all',
        'ECG_event_2_1degrSinBrady_all',
        'ECG_event_3_SinTachy_all',
        'ECG_event_4_1degrSinTachy_all',
        'ECG_event_5_SVC_all',
        'ECG_event_6_Mobitz1_all',
        'ECG_event_7_Mobitz2_all',
        'ECG_event_8_JuncTachy_all',
        'ECG_event_9_SVTA_all',
        'ECG_event_10_Afib_slow_all',
        'ECG_event_11_Afib_normal_all',
        'ECG_event_12_Afib_rapid_all',
        'ECG_event_13_Pause_all',
        'ECG_event_14_PVC_all',
        'ECG_event_15_Vcoup_all',
        'ECG_event_16_Vtrip_all',
        'ECG_event_17_Vbig_all',
        'ECG_event_18_Vtrig_all',
        'ECG_event_19_IVR_all',
        'ECG_event_20_VT_all',
        'ECG_event_21_slow_VT_all',
        'ECG_event_22_VF_all',
        'ECG_event_1_SinBrady_sleep_all',
        'ECG_event_2_1degrSinBrady_sleep_all',
        'ECG_event_3_SinTachy_sleep_all',
        'ECG_event_4_1degrSinTachy_sleep_all',
        'ECG_event_5_SVC_sleep_all',
        'ECG_event_6_Mobitz1_sleep_all',
        'ECG_event_7_Mobitz2_sleep_all',
        'ECG_event_8_JuncTachy_sleep_all',
        'ECG_event_9_SVTA_sleep_all',
        'ECG_event_10_Afib_slow_sleep_all',
        'ECG_event_11_Afib_normal_sleep_all',
        'ECG_event_12_Afib_rapid_sleep_all',
        'ECG_event_13_Pause_sleep_all',
        'ECG_event_14_PVC_sleep_all',
        'ECG_event_15_Vcoup_sleep_all',
        'ECG_event_16_Vtrip_sleep_all',
        'ECG_event_17_Vbig_sleep_all',
        'ECG_event_18_Vtrig_sleep_all',
        'ECG_event_19_IVR_sleep_all',
        'ECG_event_20_VT_sleep_all',
        'ECG_event_21_slow_VT_sleep_all',
        'ECG_event_22_VF_sleep_all',
        'ECG_event_1_SinBrady_non_sleep_all',
        'ECG_event_2_1degrSinBrady_non_sleep_all',
        'ECG_event_3_SinTachy_non_sleep_all',
        'ECG_event_4_1degrSinTachy_non_sleep_all',
        'ECG_event_5_SVC_non_sleep_all',
        'ECG_event_6_Mobitz1_non_sleep_all',
        'ECG_event_7_Mobitz2_non_sleep_all',
        'ECG_event_8_JuncTachy_non_sleep_all',
        'ECG_event_9_SVTA_non_sleep_all',
        'ECG_event_10_Afib_slow_non_sleep_all',
        'ECG_event_11_Afib_normal_non_sleep_all',
        'ECG_event_12_Afib_rapid_non_sleep_all',
        'ECG_event_13_Pause_non_sleep_all',
        'ECG_event_14_PVC_non_sleep_all',
        'ECG_event_15_Vcoup_non_sleep_all',
        'ECG_event_16_Vtrip_non_sleep_all',
        'ECG_event_17_Vbig_non_sleep_all',
        'ECG_event_18_Vtrig_non_sleep_all',
        'ECG_event_19_IVR_non_sleep_all',
        'ECG_event_20_VT_non_sleep_all',
        'ECG_event_21_slow_VT_non_sleep_all',
        'ECG_event_22_VF_non_sleep_all',
        'ECG_event_sub_all',
        'ECG_event_sub_all_sleep',
        'ECG_event_sub_all_non_sleep',
        'DAY_1_ECG_event_total',
        'DAY_1_ECG_event_sub',
        'DAY_1_ECG_event_1_SinBrady',
        'DAY_1_ECG_event_2_1degrSinBrady',
        'DAY_1_ECG_event_3_SinTachy',
        'DAY_1_ECG_event_4_1degrSinTachy',
        'DAY_1_ECG_event_5_SVC',
        'DAY_1_ECG_event_6_Mobitz1',
        'DAY_1_ECG_event_7_Mobitz2',
        'DAY_1_ECG_event_8_JuncTachy',
        'DAY_1_ECG_event_9_SVTA',
        'DAY_1_ECG_event_10_Afib_slow',
        'DAY_1_ECG_event_11_Afib_normal',
        'DAY_1_ECG_event_12_Afib_rapid',
        'DAY_1_ECG_event_13_Pause',
        'DAY_1_ECG_event_14_PVC',
        'DAY_1_ECG_event_15_Vcoup',
        'DAY_1_ECG_event_16_Vtrip',
        'DAY_1_ECG_event_17_Vbig',
        'DAY_1_ECG_event_18_Vtrig',
        'DAY_1_ECG_event_19_IVR',
        'DAY_1_ECG_event_20_VT',
        'DAY_1_ECG_event_21_slow_VT',
        'DAY_1_ECG_event_22_VF',
        'DAY_2_ECG_event_total',
        'DAY_2_ECG_event_sub',
        'DAY_2_ECG_event_1_SinBrady',
        'DAY_2_ECG_event_2_1degrSinBrady',
        'DAY_2_ECG_event_3_SinTachy',
        'DAY_2_ECG_event_4_1degrSinTachy',
        'DAY_2_ECG_event_5_SVC',
        'DAY_2_ECG_event_6_Mobitz1',
        'DAY_2_ECG_event_7_Mobitz2',
        'DAY_2_ECG_event_8_JuncTachy',
        'DAY_2_ECG_event_9_SVTA',
        'DAY_2_ECG_event_10_Afib_slow',
        'DAY_2_ECG_event_11_Afib_normal',
        'DAY_2_ECG_event_12_Afib_rapid',
        'DAY_2_ECG_event_13_Pause',
        'DAY_2_ECG_event_14_PVC',
        'DAY_2_ECG_event_15_Vcoup',
        'DAY_2_ECG_event_16_Vtrip',
        'DAY_2_ECG_event_17_Vbig',
        'DAY_2_ECG_event_18_Vtrig',
        'DAY_2_ECG_event_19_IVR',
        'DAY_2_ECG_event_20_VT',
        'DAY_2_ECG_event_21_slow_VT',
        'DAY_2_ECG_event_22_VF',
        'DAY_3_ECG_event_total',
        'DAY_3_ECG_event_sub',
        'DAY_3_ECG_event_1_SinBrady',
        'DAY_3_ECG_event_2_1degrSinBrady',
        'DAY_3_ECG_event_3_SinTachy',
        'DAY_3_ECG_event_4_1degrSinTachy',
        'DAY_3_ECG_event_5_SVC',
        'DAY_3_ECG_event_6_Mobitz1',
        'DAY_3_ECG_event_7_Mobitz2',
        'DAY_3_ECG_event_8_JuncTachy',
        'DAY_3_ECG_event_9_SVTA',
        'DAY_3_ECG_event_10_Afib_slow',
        'DAY_3_ECG_event_11_Afib_normal',
        'DAY_3_ECG_event_12_Afib_rapid',
        'DAY_3_ECG_event_13_Pause',
        'DAY_3_ECG_event_14_PVC',
        'DAY_3_ECG_event_15_Vcoup',
        'DAY_3_ECG_event_16_Vtrip',
        'DAY_3_ECG_event_17_Vbig',
        'DAY_3_ECG_event_18_Vtrig',
        'DAY_3_ECG_event_19_IVR',
        'DAY_3_ECG_event_20_VT',
        'DAY_3_ECG_event_21_slow_VT',
        'DAY_3_ECG_event_22_VF',
        'DAY_4_ECG_event_total',
        'DAY_4_ECG_event_sub',
        'DAY_4_ECG_event_1_SinBrady',
        'DAY_4_ECG_event_2_1degrSinBrady',
        'DAY_4_ECG_event_3_SinTachy',
        'DAY_4_ECG_event_4_1degrSinTachy',
        'DAY_4_ECG_event_5_SVC',
        'DAY_4_ECG_event_6_Mobitz1',
        'DAY_4_ECG_event_7_Mobitz2',
        'DAY_4_ECG_event_8_JuncTachy',
        'DAY_4_ECG_event_9_SVTA',
        'DAY_4_ECG_event_10_Afib_slow',
        'DAY_4_ECG_event_11_Afib_normal',
        'DAY_4_ECG_event_12_Afib_rapid',
        'DAY_4_ECG_event_13_Pause',
        'DAY_4_ECG_event_14_PVC',
        'DAY_4_ECG_event_15_Vcoup',
        'DAY_4_ECG_event_16_Vtrip',
        'DAY_4_ECG_event_17_Vbig',
        'DAY_4_ECG_event_18_Vtrig',
        'DAY_4_ECG_event_19_IVR',
        'DAY_4_ECG_event_20_VT',
        'DAY_4_ECG_event_21_slow_VT',
        'DAY_4_ECG_event_22_VF',
        'HOUR_1_ECG_event_total',
        'HOUR_1_ECG_event_sub',
        'HOUR_1_ECG_event_1_SinBrady',
        'HOUR_1_ECG_event_2_1degrSinBrady',
        'HOUR_1_ECG_event_3_SinTachy',
        'HOUR_1_ECG_event_4_1degrSinTachy',
        'HOUR_1_ECG_event_5_SVC',
        'HOUR_1_ECG_event_6_Mobitz1',
        'HOUR_1_ECG_event_7_Mobitz2',
        'HOUR_1_ECG_event_8_JuncTachy',
        'HOUR_1_ECG_event_9_SVTA',
        'HOUR_1_ECG_event_10_Afib_slow',
        'HOUR_1_ECG_event_11_Afib_normal',
        'HOUR_1_ECG_event_12_Afib_rapid',
        'HOUR_1_ECG_event_13_Pause',
        'HOUR_1_ECG_event_14_PVC',
        'HOUR_1_ECG_event_15_Vcoup',
        'HOUR_1_ECG_event_16_Vtrip',
        'HOUR_1_ECG_event_17_Vbig',
        'HOUR_1_ECG_event_18_Vtrig',
        'HOUR_1_ECG_event_19_IVR',
        'HOUR_1_ECG_event_20_VT',
        'HOUR_1_ECG_event_21_slow_VT',
        'HOUR_1_ECG_event_22_VF',
        'HOUR_AFTER_ECG_event_total',
        'HOUR_AFTER_ECG_event_sub',
        'HOUR_AFTER_ECG_event_1_SinBrady',
        'HOUR_AFTER_ECG_event_2_1degrSinBrady',
        'HOUR_AFTER_ECG_event_3_SinTachy',
        'HOUR_AFTER_ECG_event_4_1degrSinTachy',
        'HOUR_AFTER_ECG_event_5_SVC',
        'HOUR_AFTER_ECG_event_6_Mobitz1',
        'HOUR_AFTER_ECG_event_7_Mobitz2',
        'HOUR_AFTER_ECG_event_8_JuncTachy',
        'HOUR_AFTER_ECG_event_9_SVTA',
        'HOUR_AFTER_ECG_event_10_Afib_slow',
        'HOUR_AFTER_ECG_event_11_Afib_normal',
        'HOUR_AFTER_ECG_event_12_Afib_rapid',
        'HOUR_AFTER_ECG_event_13_Pause',
        'HOUR_AFTER_ECG_event_14_PVC',
        'HOUR_AFTER_ECG_event_15_Vcoup',
        'HOUR_AFTER_ECG_event_16_Vtrip',
        'HOUR_AFTER_ECG_event_17_Vbig',
        'HOUR_AFTER_ECG_event_18_Vtrig',
        'HOUR_AFTER_ECG_event_19_IVR',
        'HOUR_AFTER_ECG_event_20_VT',
        'HOUR_AFTER_ECG_event_21_slow_VT',
        'HOUR_AFTER_ECG_event_22_VF',
        'Sleep_average_time_min',
        'Sleep_1_night_time_min',
        'Sleep_2_night_time_min',
        'Sleep_3_night_time_min',
        'Sleep_average_efficiency',
        'Sleep_1_night_efficiency',
        'Sleep_2_night_efficiency',
        'Sleep_3_night_efficiency',
        'Stress_average_total',
        'Stress_1_day',
        'Stress_2_day',
        'Stress_3_day',
        'Stress_4_day',
        'Stress_average_total_sleep',
        'Stress_1_sleep',
        'Stress_2_sleep',
        'Stress_3_sleep',
        'Stress_4_sleep',
        'Stress_average_total_non_sleep',
        'Stress_1_non_sleep',
        'Stress_2_non_sleep',
        'Stress_3_non_sleep',
        'Stress_4_non_sleep',
        'Activity_average_step',
        'Activity_1_day_step',
        'Activity_2_day_step',
        'Activity_3_day_step',
        'Activity_4_day_step',
        'Activity_average_kcal',
        'Activity_1_day_kcal',
        'Activity_2_day_kcal',
        'Activity_3_day_kcal',
        'Activity_4_day_kcal',
        'Total_Analysis_sec',
        'Total_No_Signal_sec',
        'HOUR_12_No_Signal_sec',
        'HOUR_24_No_Signal_sec',
        'HOUR_36_No_Signal_sec',
        'HOUR_48_No_Signal_sec',
        'HOUR_60_No_Signal_sec',
        'HOUR_72_No_Signal_sec'
      ]
    }
  },
  computed: {
    loaded () {
      return this.items.length > 0
    }
  },
  methods: {
    async load () {
      this.loading = true
      const response = await this.$axios.get('http://cardian.nbnl.co/api/v/summary')
      this.items = response.data
      this.loading = false
    },
    _convertToCSV (object) {
      const array = typeof object !== 'object' ? JSON.parse(object) : object
      let str = ''
      let header = this.csvHeaders.join(',')
      str += header + '\r\n'
      array.forEach((e) => {
        str += e.csv + '\r\n'
      })
      return str
    },
    convertFile () {
      const csv = this._convertToCSV(this.items)
      let path = require('path')
      let toLocalPath = path.resolve(app.getPath('desktop'), path.basename('export.txt'))
      let userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath })
      try {
        fs.writeFileSync(userChosenPath, csv, 'utf-8')
      } catch (e) {
        alert('Failed to save the file !')
      }
    }
  }
}
</script>
