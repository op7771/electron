<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container ma-0 row>
    <v-layout>
      <v-flex>
        <h1 class="headline font-weight-bold mb-3">
          Data Wave
        </h1>
      </v-flex>
      <v-flex shrink>
        <v-btn
          color="primary"
          @click="openDialog"
        >
          Select Folder
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        xs12
        sm12
        md12
        lg6
      >
        <v-card>
          <v-card-title class="subheading font-weight-bold">Information</v-card-title>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Hospital:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.hospital }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Gender:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.gender }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Birthday:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.birthday | dateFormat }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Height:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.height }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Weight:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.weight }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Event:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.event }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Time:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ information.time }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout mt-2>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="raw channel 1" :data="raw.channel1" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="raw channel 2" :data="raw.channel2" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="raw channel 3" :data="raw.channel3" :time="information.time"></LineChart>
      </v-flex>
    </v-layout>

    <v-layout mt-2>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="band channel 1" :data="band.channel1" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="band channel 2" :data="band.channel2" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="band channel 3" :data="band.channel3" :time="information.time"></LineChart>
      </v-flex>
    </v-layout>

    <v-layout mt-2>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="filtered channel 1" :data="filtered.channel1" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="filtered channel 2" :data="filtered.channel2" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="filtered channel 3" :data="filtered.channel3" :time="information.time"></LineChart>
      </v-flex>
    </v-layout>
    <v-layout mt-2>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="acc x-axis" :data="acc.channel1" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="acc y-axis" :data="acc.channel2" :time="information.time"></LineChart>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4>
        <LineChart title="acc z-axis" :data="acc.channel3" :time="information.time"></LineChart>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as moment from 'moment'
import LineChart from '../components/LineChart'

export default {
  name: 'Wave',
  components: {
    LineChart
  },
  data () {
    return {
      selectedPath: '',
      information: {
        hospital: '',
        gender: '',
        birthday: '',
        height: '',
        weight: '',
        event: '',
        time: ''
      },
      filtered: {
        channel1: [], channel2: [], channel3: []
      },
      raw: {
        channel1: [], channel2: [], channel3: []
      },
      band: {
        channel1: [], channel2: [], channel3: []
      },
      acc: {
        channel1: [], channel2: [], channel3: []
      }
    }
  },
  filters: {
    dateFormat (val) {
      return val ? moment(val).format('YYYY-MM-DD') : ''
    }
  },
  watch: {
    selectedPath (v) {
      this.loadInformation(path.join(v, 'note.txt'))
      this.loadWave(path.join(v, 'filteredECG.bin'), 16).then(({ array1, array2, array3 }) => {
        this.filtered.channel1 = array1
        this.filtered.channel2 = array2
        this.filtered.channel3 = array3
      })

      this.loadWave(path.join(v, 'acc.bin')).then(({ array1, array2, array3 }) => {
        this.acc.channel1 = array1
        this.acc.channel2 = array2
        this.acc.channel3 = array3
      })

      this.loadWave(path.join(v, 'rawECG.bin')).then(({ array1, array2, array3 }) => {
        this.raw.channel1 = array1
        this.raw.channel2 = array2
        this.raw.channel3 = array3
      })
      this.loadWave(path.join(v, 'bandPassFilterECG.bin')).then(({ array1, array2, array3 }) => {
        this.band.channel1 = array1
        this.band.channel2 = array2
        this.band.channel3 = array3
      })
    }
  },
  mounted () {
    ipcRenderer.on('selected-directory', (event, paths) => {
      console.log('selectedPath ', paths)
      this.selectedPath = paths[0]
    })
  },
  methods: {
    openDialog () {
      ipcRenderer.send('open-directory-dialog')
    },
    loadInformation (filePath) {
      let temp = path.parse(path.dirname(filePath)).name
      let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
      this.information.hospital = lines[0]
      this.information.gender = lines[1]
      this.information.birthday = lines[2]
      this.information.height = lines[3]
      this.information.weight = lines[4]
      this.information.event = lines[5]
      temp = temp.split('-')
      this.information.time = temp[1] + '-' + temp[2] + '-' + temp[3]
    },
    async loadWave (filePath, bit) {
      let buffer = fs.readFileSync(filePath)
      let channel1 = []
      let channel2 = []
      let channel3 = []
      let position = 0
      let is16Bit = bit === 16
      let amount = is16Bit ? 2 : 4
      for (let i = 0; i < buffer.length; i++) {
        channel1[i] = is16Bit ? buffer.readInt16LE(position) : buffer.readInt32LE(position)
        position = position + amount
        channel2[i] = is16Bit ? buffer.readInt16LE(position) : buffer.readInt32LE(position)
        position = position + amount
        channel3[i] = is16Bit ? buffer.readInt16LE(position) : buffer.readInt32LE(position)
        position = position + amount
        if (buffer.length === position) {
          break
        }
      }
      return {
        array1: channel1,
        array2: channel2,
        array3: channel3
      }
    }
  }
}
</script>

<style scoped>

</style>
