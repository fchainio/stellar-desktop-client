/**
 * 创建账户页面
 */
<template>
<div class="page">
  <div class="create-account-page page-a">
    <toolbar :title="$t(title)" :showbackicon="showbackicon">
      <v-btn icon style="visibility: hidden;" slot="left-tool">
        <v-icon class="back-icon"/>
      </v-btn>
    </toolbar>
    <m-layout :left='false'>
    <div class="">
      <v-text-field
              dark
              name="name"
              :label="$t('Account.AccountName')"
              v-model="name"
              required
              append-icon='cached'
              :append-icon-cb="this.chooseName"
            ></v-text-field>  
      <v-text-field
              dark
              name="password"
              :label="$t('Account.Password')"
              v-model="password"
              :append-icon="pwdvisible ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (pwdvisible = !pwdvisible)"
              :type="pwdvisible ? 'text':'password'"
              required
            ></v-text-field>
      <v-text-field
              dark
              :label="$t('Account.ConfirmPassword')"
              v-model="repassword"
              :append-icon="repwdvisible ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (repwdvisible = !repwdvisible)"
              :type="repwdvisible? 'text': 'password'"
              required
              @keyup.enter.native="nextStep"
            ></v-text-field>
      <div class="hint">{{$t('Account.CreateAccountHint')}}</div>
    </div>
    <div class="footer">
      <v-layout row wrap>
        <v-flex xs6 @click="goback">
          <span>{{$t('Return')}}</span>
        </v-flex>
        <v-flex xs6 @click="nextStep">
          <span :class="nextStepClass">{{$t('NextStep')}}</span>
        </v-flex>
       </v-layout>  
    </div>
    </m-layout>
  </div>
</div>
</template>

<script>
import Toolbar from '../components/Toolbar'
import { mapState, mapActions} from 'vuex'
import { random } from '../api/account'
import { RandomPlanetsCount, RandomColorsCount } from '../locales/index'
const TITLE = 'CreateAccount'
export default {
  data(){
    return {
      title: TITLE,
      showbackicon: false,
      name:null,
      password: null,
      repassword: null,
      pwdvisible: false,
      repwdvisible: false,
    }
  },
  computed:{
    ...mapState({
      seed: state => state.seed,
      isImportAccount: state => state.isImportAccount,
      isCreateAccount: state => state.isCreateAccount,
    }),
    nextStepClass(){
      if(this.name && this.password && this.repassword && this.password === this.repassword){
        return 'btn-available'
      }
      return 'btn-unavailable'
    }
  },
  mounted(){
    this.chooseName()
  },
  methods: {
    ...mapActions({
      setNewSeed: 'setNewSeed',
      setCreateAccountData: 'setCreateAccountData'
    }),
    chooseName(){
      let planetNum = Math.floor(Math.random()*(RandomPlanetsCount -1))
      let colorNum = Math.floor(Math.random()*(RandomColorsCount - 1))
      let colors = this.$t('Random.Colors').split("|")
      let planets = this.$t('Random.Planets').split("|")
      this.name =  colors[colorNum]+planets[planetNum]
    },
    goback(){
      this.$router.back()
    },
    nextStep(){
      if(this.name && this.password && this.repassword && this.password === this.repassword){
        this.setCreateAccountData({name:this.name,password:this.password})
        if(this.isCreateAccount){
          //创建账号
          let seed = random()
          this.setNewSeed(seed)
        }
        this.$router.push({name:'CreateAccountReady'})
      }
    },
  },
  components: {
    Toolbar
  }
}
</script>


<style lang="stylus" scoped>
@require '../stylus/color.styl'
.create-account-page
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $secondarycolor.gray
  z-index:999
.footer
  position:fixed
  bottom:0
  bottom: constant(safe-area-inset-bottom)
  bottom: env(safe-area-inset-bottom)
  left:0
  right:0
  z-index:99
  background:$primarycolor.gray
  height:42px
  line-height:42px
  font-size:16px
  text-align:center
  color:$primarycolor.green
.btn-available
  color:$primarycolor.green
.btn-unavailable
  color:$secondarycolor.green
.hint
  color:$primarycolor.green
  font-size: 14px
  
</style>

