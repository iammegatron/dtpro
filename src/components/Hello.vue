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
        <h1 class="title is-3">Gear Ratio </h1>
      </div>
      <div class="box column is-2">
        <!-- <h1 class="title is-3">20:1</h1> -->
        <div class="select">
          <select v-model="steps[x].gear">
            <option value="100">100:1</option>
            <option value="50">50:1</option>
            <option value="20">20:1</option>

          </select>

        </div>
      </div>
      <div class="column is-2">
      </div>
      <div class="box column is-2">
        <!-- <h1 class="title is-3">50</h1> -->
        <div class="select">
          <select v-model="steps[x].torque">
            <option value="300">300</option>
            <option value="150">150</option>
            <option value="60">60</option>

          </select>

        </div>
      </div>
      <div class="column is-3">
        <h1 class="title is-3">N cm</h1>
      </div>
    </div>

    <!-- RPM -->
    <div class="columns">
      <div class="column is-7">
        <vue-slider v-model="steps[x].rpm" :height=40 :dotSize=60 :max="maxrpm"> </vue-slider>
      </div>
      <div class="box column is-2">
        <h1 class="title is-3">{{steps[x].rpm}}</h1>
      </div>
      <div class="column is-3">
        <h1 class="title is-3">RPM</h1>
      </div>

    </div>


    <!-- FOOTER -->
    <div class="block">
      <div class="columns">
        <div class="column is-2">
          <button @click="x = (x-1>0)?x-1:1">
            <span><i class="fa fa-3x fa-step-backward"></i></span>

          </button>
        </div>
        <div class="column is-4">

          <progress class="progress is-primary is-large" v-bind:value="x*20" max="100"></progress>
          <span class="tag is-success">step {{x}}</span>
        </div>

        <div class="column is-2">
          <button @click="x = (x+1<5)?x+1:5">
            <span><i class="fa fa-3x fa-step-forward"></i></span>

          </button>
        </div>
        <div class="column is-2">
          <button @click="save">
            <span><i class="fa fa-3x fa-floppy-o"></i></span>
          </button>
        </div>


        <div class="column is-2">
          <button class="button is-primary" @click="update" >
            <span class="icon"><i class="fa fa-download"></i></span>
            <span>Update</span>
          </button>
        </div>

      </div>

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
      // gear:100,
      // torque:300,
      x:1,
      steps:{
        1:{
          gear:100,
          torque:300,
          rpm:400
        },
        2:{
          gear:50,
          torque:150,
          rpm:800
        },
        3:{
          gear:20,
          torque:300,
          rpm:400
        },
        4:{
          gear:50,
          torque:60,
          rpm:2000
        },
        5:{
          gear:50,
          torque:300,
          rpm:400
        }
      },
      // rpm: 20,
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
    'myrpm': function(val){
      console.log(val);
      request.get('/acspeed').query({rpm:val}).end();
    },
    'fluid_rate': function(val){
      if(this.isfluidon){
        request.get('/dcmotor').query({rpm:this.fluid_rate}).end();
      }
    },
    'x':function(){
      if(this.isrun){
        this.isrun = false;
        request.get('/acmotor').query({run:+this.isrun}).end();
      }
    }
  },
  created:function(){
    window.addEventListener('keypress', this.ev1);
    request.get('/load').end((err,res)=>{
      console.log(err,res.body);
      this.steps = res.body;
    });
  },
  computed:{
    myrpm:function(){
      return this.steps[this.x].rpm;
    },
    maxrpm:function(){
      return 120000/this.steps[this.x].torque;
    }
  },
  methods:{
    save(){
      request.post('/save').send(this.steps).end((err,res)=>{
        console.log("sent", this.steps);
      });
    },
    ev1(event){
      switch(event.keyCode){
        case 49:  //1
          this.toggleFluidOn();
          break;
        case 50: //2
          this.toggleRun();
          break;
        case 51: //3
          this.toggleForward();
          break;
        case 52: //4
          this.stepNext();
          break;
      }

    },
    stepNext(){
      this.x = (this.x % 5) + 1
      console.log("next step",this.x);
    },
    toggleFluidOn(){
      this.isfluidon = !this.isfluidon;
      if(this.isfluidon){
        request.get('/dcmotor').query({rpm:this.fluid_rate}).end();
      }else{
        request.get('/dcmotor').query({rpm:0}).end();
      }
    },
    toggleForward(){
      this.isforward = !this.isforward;
      request.get('/direction').query({dir:+this.isforward}).end();
    },
    toggleRun(){
      this.isrun = !this.isrun;
      request.get('/acmotor').query({run:+this.isrun}).end();
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
