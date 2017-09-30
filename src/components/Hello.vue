<template>
  <div class="container">
    <button class="button is-primary" @click="update" >Update Software</button>
    <button type="button" name="button" @click="kk">asdfa</button>
    <div class="block">
      <i class="fa fa-5x fa-tint"></i><i class="fa fa-3x fa-tint"></i>
      {{value}}
    </div>
    <div class="block">
      <fa-rating glyph="fa-tint" :max-rating=8 v-model="msg">
      </fa-rating>

    </div>
    <div class="block">
      <vue-slider v-model="value"></vue-slider>
    </div>
  </div>



</template>

<script>
import request from "superagent"

import {FaRating} from 'vue-rate-it'
import vueSlider from 'vue-slider-component'

export default {
  name: 'hello',
  data () {
    return {
      msg: 2,
      value:3
    }
  },
  components:{
    FaRating,
    vueSlider
  },
  methods:{
    kk(){
      request.get("/aa").end((err,res)=>{
        console.log(err,res)
      })
    },
    update(){
      console.log("updating...")
      request.get('/update').end((err,res)=>{
        console.log(err,res);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
