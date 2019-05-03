<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container ma-0 row>
    <v-layout>
      <v-flex>
        <h1 class="headline font-weight-bold mb-3">
          Inspection Export
        </h1>
      </v-flex>
    </v-layout>
    <v-expansion-panel v-model="panel" expand>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div class="title">Export Request Option</div>
        </template>
        <v-layout>
          <form>
            <v-flex>
              <v-card>
                <v-layout row wrap md12>
                  <v-flex md12>
                    <v-card-text class="pb-0">
                      <v-combobox
                        required
                        v-model="exportOption.events"
                        :items="fixedEvents"
                        item-text="cdNm"
                        item-value="cdNm"
                        label="Events"
                        clearable
                        deletable-chips
                        multiple
                        chips
                        :error-messages="eventErrors"
                        @input="$v.exportOption.events.$touch()"
                        @blur="$v.exportOption.events.$touch()"
                      ></v-combobox>
                    </v-card-text>
                  </v-flex>

                  <v-flex md6>
                    <v-card-text class="pb-0">
                      <v-select
                        required
                        v-model="exportOption.genders"
                        :items="genders"
                        item-text="text"
                        item-value="value"
                        label="Gender"
                        flat
                        clearable
                        deletable-chips
                        multiple
                        chips
                        :error-messages="genderErrors"
                        @input="$v.exportOption.genders.$touch()"
                        @blur="$v.exportOption.genders.$touch()"
                      ></v-select>
                    </v-card-text>
                  </v-flex>
                  <v-flex md6>
                    <v-card-text class="pb-0">
                      <v-combobox
                        v-model="exportOption.hospitals"
                        :items="hospitals"
                        item-text="name"
                        item-value="hospitalSequenceNumber"
                        label="Hospital"
                        clearable
                        deletable-chips
                        multiple
                        chips
                      ></v-combobox>
                    </v-card-text>
                  </v-flex>

                  <v-flex md6>
                    <v-card-text class="pb-0">
                      <v-menu
                        v-model="rangeStartDateTime"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="exportOption.rangeStartDateTime"
                            label="Range of inspection start date start"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="exportOption.rangeStartDateTime"
                                       @input="startPicker = false"></v-date-picker>
                      </v-menu>
                    </v-card-text>
                  </v-flex>
                  <v-flex md6>
                    <v-card-text class="pb-0">
                      <v-menu
                        v-model="rangeEndDateTime"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="exportOption.rangeEndDateTime"
                            label="Range of inspection start date end"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="exportOption.rangeEndDateTime"
                                       @input="endPicker = false"></v-date-picker>
                      </v-menu>
                    </v-card-text>
                  </v-flex>

                  <v-flex md5>
                    <v-card-text class="pb-0">
                      <v-text-field label="Device ID" v-model="exportOption.deviceId"></v-text-field>
                    </v-card-text>
                  </v-flex>
                  <v-flex md5>
                    <v-card-text class="pb-0">
                      <v-text-field label="Duration" v-model="exportOption.duration" mask="#"></v-text-field>
                    </v-card-text>
                  </v-flex>

                  <v-flex md2>
                    <v-card-text>
                      <v-checkbox
                        v-model="exportOption.justDeleted"
                        label="Search Just deleted."
                        color="orange darken-3"
                        hide-details
                      ></v-checkbox>
                    </v-card-text>
                  </v-flex>
                  <v-flex md12>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="orange" @click="submit" :loading="loading" :disabled="loading">REQUEST</v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </form>
        </v-layout>
      </v-expansion-panel-content>

      <v-expansion-panel-content mt-2>
        <template v-slot:header>
          <div class="title">Export Request Result</div>
        </template>
        <v-layout class="mt-2">
          <v-flex>
            <v-card>
              <v-layout row wrap md12>
                <v-flex>
                  <v-btn block color="primary" dark :loading="loading2" @click="load">Reload</v-btn>
                  <div>
                    <v-data-table
                      :headers="headers"
                      :items="requests"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="text-xs-center">{{ props.item.eventString }}</td>
                        <td class="text-xs-center">{{ props.item.hospitalString }}</td>
                        <td class="text-xs-center">{{ props.item.genderString }}</td>
                        <td class="text-xs-center">{{ props.item.deviceId }}</td>
                        <td class="text-xs-center">
                          <v-switch value color="warning" :input-value="props.item.justDeleted"
                                    class="eventNone justify-center"/>
                        </td>
                        <td class="text-xs-center">{{ props.item.duration }} Sec</td>
                        <td class="text-xs-center">{{ props.item.count }}</td>
                        <td class="justify-center layout px-0">
                          <v-btn color="accent" fab small @click="run(props.item)" v-if="props.item.status === 'REQ'">
                            <v-icon >play_arrow</v-icon>
                          </v-btn>
                          <v-btn color="secondary" fab small v-else-if="props.item.status === 'PROC'">
                            <v-icon >cached</v-icon>
                          </v-btn>
                          <v-btn color="primary" fab small @click="down(props.item)" v-else>
                            <v-icon >cloud_download</v-icon>
                          </v-btn>
                          <v-btn color="error" fab small @click="deleteItem(props.item)">
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { ipcRenderer, remote } from 'electron'
import path from 'path'

const dialog = remote.dialog
const app = remote.app

export default {
  name: 'Export',
  mixins: [validationMixin],

  validations: {
    exportOption: {
      events: { required },
      genders: { required }
    }
  },
  data () {
    return {
      panel: [true, false],
      rangeStartDateTime: false,
      rangeEndDateTime: false,
      fixedEvents: [],
      hospitals: [],
      loading: false,
      loading2: false,
      publicPath: process.env.NODE_ENV === 'production' ? 'http://cardian.nbnl.co/api/v' : 'http://localhost:8080/api/v',
      headers: [
        { align: 'center', text: 'Events', value: 'eventString' },
        { align: 'center', text: 'Hospital', value: 'hospitalString' },
        { align: 'center', text: 'Gender', value: 'genderString' },
        { align: 'center', text: 'DeviceId', value: 'deviceId' },
        { align: 'center', text: 'Just Deleted', value: 'justDeleted' },
        { align: 'center', text: 'Duration', value: 'duration' },
        { align: 'center', text: 'Counts', value: 'count' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      requests: [],
      genders: [
        { text: 'MALE', value: 'M' },
        { text: 'FEMALE', value: 'F' }
      ],
      exportOption: {
        genders: [],
        justDeleted: false,
        deviceId: '',
        events: [],
        duration: 2,
        rangeEndDateTime: '',
        rangeStartDateTime: ''
      }
    }
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
      ) {
        return 0
      }
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    eventErrors () {
      const errors = []
      if (!this.$v.exportOption.$dirty) return errors
      !this.$v.exportOption.events.required && errors.push('Events is required')
      return errors
    },
    genderErrors () {
      const errors = []
      if (!this.$v.exportOption.$dirty) return errors
      !this.$v.exportOption.genders.required && errors.push('Gender is required')
      return errors
    }
  },
  created () {
    this.load()
    this.$axios.get('/code/evs').then((res) => {
      this.fixedEvents = this.$_.filter(res.data, (e) => e.cdAttr === 'EVT')
    })
    this.$axios.get('/hospitals').then((res) => {
      this.hospitals = res.data
    })
  },
  methods: {
    load () {
      console.log(this.publicPath)
      this.loading2 = true
      this.$axios.get('/export/request').then((res) => {
        this.requests = res.data
        this.loading2 = false
      })
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        this.loading = true
        console.debug(this.exportOption)
        this.$axios.post('/export/request', this.exportOption).then((res) => {
          res.data.status = 'REQ'
          this.requests.push(res.data)
          this.$v.$reset()
          this.exportOption.genders = []
          this.exportOption.hospitals = []
          this.exportOption.justDeleted = false
          this.exportOption.deviceId = ''
          this.exportOption.events = []
          this.exportOption.duration = 2
          this.exportOption.rangeStartDateTime = ''
          this.exportOption.rangeEndDateTime = ''
          this.loading = false
        }).catch((e) => {
          this.loading = false
        })
      }
    },
    async run (item) {
      let param = Object.assign({}, item)
      param.status = 'PROC'
      await this.$axios.put('/export/request', param)
      item.status = 'PROC'
    },
    async down (item) {
      let toLocalPath = path.resolve(app.getPath('downloads'), path.basename('download-' + item.sequence + '.zip'))
      let userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath })
      ipcRenderer.send('download', {
        url: this.publicPath + '/export/request/' + item.sequence,
        properties: {
          directory: path.dirname(userChosenPath),
          filename: path.basename(userChosenPath),
          onProgress: this.progress
        }
      })
      ipcRenderer.on('download progress', (event, progress) => {
        const progressInPercentages = progress * 100 // With decimal point and a bunch of numbers
        const cleanProgressInPercentages = Math.floor(progress * 100) // Without decimal point
        console.log(progressInPercentages, cleanProgressInPercentages)
      })
      ipcRenderer.on('download complete', (event, file) => {
        alert('File successfully downloaded.')
      })
    },
    deleteItem (item) {
      this.$axios.delete('/export/request/' + item.sequence).then(() => {
        const index = this.requests.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.requests.splice(index, 1)
      })
    }

  }
}
</script>
<style>
  .eventNone {
    pointer-events: none
  }
</style>
