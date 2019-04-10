<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container ma-0 row>
    <v-layout>
      <v-flex>
        <h1 class="headline font-weight-bold mb-3">
          Inspection Export
        </h1>
      </v-flex>
    </v-layout>
    <v-layout>
      <form>
        <v-flex>
          <v-card>
            <v-toolbar
              dense
              card
              color="grey lighten-2"
            >
              <v-toolbar-title>Export Request Option</v-toolbar-title>
            </v-toolbar>

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
                    <v-date-picker v-model="exportOption.rangeStartDateTime" @input="startPicker = false"></v-date-picker>
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
                    <v-date-picker v-model="exportOption.rangeEndDateTime" @input="endPicker = false"></v-date-picker>
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

    <v-layout class="mt-2">
      <v-flex>
        <v-card>
          <v-toolbar
            dense
            card
            color="grey lighten-2"
          >
            <v-toolbar-title>Export Request Result</v-toolbar-title>
          </v-toolbar>
          <v-layout row wrap md12>
            <v-flex>

            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
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
      rangeStartDateTime: false,
      rangeEndDateTime: false,
      fixedEvents: [],
      hospitals: [],
      loading: false,
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
    this.$axios.get('/code/evs').then((res) => {
      this.fixedEvents = this.$_.filter(res.data, (e) => e.cdAttr === 'EVT')
    })
    this.$axios.get('/hospitals').then((res) => {
      this.hospitals = res.data
    })
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        this.loading = true
        console.log(this.exportOption)
        this.$axios.post('/export/request', this.exportOption).then((res) => {
          console.log(res)
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
        }).catch((error) => {
          console.log(error)
          this.loading = false
        })
      }
    }
  }
}
</script>
