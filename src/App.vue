<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>



<script>

import 'bulma/css/bulma.css'
import('font-awesome/css/font-awesome.css')

export default {
  name: 'app'
}
</script>

<style>
/* raleway-regular - latin */
@font-face {
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 400;
  src: local('Raleway'), local('Raleway-Regular'),
       url('./assets/raleway-v11-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./assets/raleway-v11-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:40px 40px;
}


</style>
