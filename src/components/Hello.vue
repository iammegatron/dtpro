<template>
  <div class="container">
    <!-- top button -->
    <div class="columns">
      <button class="column is-3 button is-large" @click="toggleFluidOn" :class="{'is-success': isfluidon}">
        <span class="icon">
          <i class="fa fa-2x fa-tint"></i>
        </span>
      </button>

      <div class="column is-6 ">
        <button class="button is-large is-fullwidth" @click="toggleRun" :class="{'is-success':isrun}">
          <span class="icon">
            <i class="fa fa-2x fa-play-circle"></i>
          </span>
        </button>
      </div>

      <button class="column is-3 button is-large" @click="toggleForward" :class="{'is-info':isforward, 'is-warning':!isforward}">
        <span class="icon">
          <i class="fa fa-2x fa-circle-o-notch"></i>
        </span>
      </button>
    </div>

    <div class="block">
      <fa-rating glyph="fa-tint" :max-rating=5 :show-rating=false v-model="fluid_rate">
      </fa-rating>
    </div>

    <!-- BLDC -->
    <div class="columns">
      <div class="column is-3">
        <h1 class="title is-3">Gear Ratio</h1>
      </div>
      <div class="box column is-2">
        <h1 class="title is-3">20:1</h1>
      </div>
      <div class="column is-2">
      </div>
      <div class="box column is-2">
        <h1 class="title is-3">50</h1>
      </div>
      <div class="column is-3">
        <h1 class="title is-3">N cm</h1>
      </div>
    </div>

    <!-- RPM -->
    <div class="columns">
      <div class="column is-7">
        <vue-slider v-model="rpm" :height=40 :dotSize=60> </vue-slider>
      </div>
      <div class="box column is-2">
        <h1 class="title is-3">{{rpm}}</h1>
      </div>
      <div class="column is-3">
        <h1 class="title is-3">RPM</h1>
      </div>

    </div>


    <!-- FOOTER -->
    <div class="block">

        <button class="button is-primary" @click="update" >
          <span class="icon"><i class="fa fa-download"></i></span>
          <span>Update Software</span>
        </button>

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
      rpm: 2,
      fluid_rate:1,
      isfluidon:false,
      isforward:true,
      isrun:false
    }
  },
  components:{
    FaRating,
    vueSlider
  },
  watch:{
    'rpm': function(val, oldval){
      console.log(val);
    }
  },
  methods:{
    toggleFluidOn(){
      this.isfluidon = !this.isfluidon;
    },
    toggleForward(){
      this.isforward = !this.isforward;
    },
    toggleRun(){
      this.isrun = !this.isrun;
    },
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

.is-round {
 height: 140px;
 width: 140px;
 border-radius: 50%;
}

</style>
