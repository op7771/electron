<template>
  <v-card>
    <v-card-title>
      <div>
        <div class="subheading font-weight-bold text-uppercase">{{ title }}</div>
        <span class="caption grey--text">{{ time }}</span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-sheet color="transparent">
      <v-sparkline
        :smooth="2"
        :gradient="['#f72047', '#ffd200', '#1feaea']"
        :line-width="1"
        :value="data"
        :padding="10"
      ></v-sparkline>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  name: 'LineChart',
  props: ['data', 'title', 'time']
}
</script>
