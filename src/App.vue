<template>
  <v-app id="wrapper">

    <v-navigation-drawer v-model="drawer"
                         temporary
                         class="grey lighten-4"
                         app>
      <v-list>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dense app absolute clipped-left dark color="blue darken-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>SAMSUNG </span>
        <span class="font-weight-light">CARDIAN TOOLS</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content class="grey lighten-4">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      drawer: true,
      items: [
        { icon: 'dashboard', title: 'Home', link: '/' },
        { icon: 'file_copy', title: 'Summaries', link: '/summaries' },
        { icon: 'cloud_download', title: 'Export', link: '/export' },
        { icon: 'question_answer', title: 'About', link: '/about' }
      ]
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.headline { font-family: 'Source Sans Pro', sans-serif !important;}

/*#wrapper {*/
  /*background:*/
    /*radial-gradient(*/
      /*ellipse at top left,*/
      /*rgba(255, 255, 255, 1) 40%,*/
      /*rgba(229, 229, 229, .9) 100%*/
    /*);*/
  /*height: 100vh;*/
  /*width: 100vw;*/
/*}*/
</style>
<style lang="stylus">
  #wrapper
    .v-navigation-drawer__border
      display: none
  .container
      max-width : 99vw !important
</style>
