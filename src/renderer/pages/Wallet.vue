/**
 * 创建钱包账户界面
 */
<template>
  <div class="create-account-page page">
    <v-btn icon v-show="showbackicon" @click="back" class="white--text back-btn">
        <i class="material-icons back-icon">&#xE5CB;</i>
      </v-btn>

    <div class="logo">
      <img src="../assets/img/logo-blank.png" alt="firefly" class="logo-img"/>
    </div>
    <div class="mt-5 textcenter">
       <v-layout row wrap>
        <v-flex xs12 @click="importAccount">
          <v-btn  class="width30">{{$t('ImportAccount')}}</v-btn>
        </v-flex>
        <v-flex xs12  @click="createAccount">
          <v-btn color="info"  class="width30">{{$t('CreateAccount')}}</v-btn>
        </v-flex>
       </v-layout>  
    </div>  
  </div>  
</template>
<script>
import { mapState,mapActions} from 'vuex'
export default {
  computed:{
    ...mapState({
      accounts: state => state.accounts.data
    }),
    showbackicon(){
      if(this.accounts && this.accounts.length > 0 )return true
      return false
    }
  },
  methods: {
    ...mapActions({
      doImportAccount: 'importAccountChange',
      doCreateAccount: 'createAccountChange'
    }),
    importAccount(){
      this.doImportAccount()
      this.$router.push({name: 'TermsOfService'})
    },
    createAccount(){
      this.doCreateAccount()
      this.$router.push({name: 'TermsOfService'})
    },
    back(){
      this.$router.back()
      //this.$router.push({name: 'Guidepage'})
    }
  }
}
</script>
<style lang="stylus" scoped>
@require '../stylus/color.styl'
.back-icon
  font-size: 32px
.create-account-page.page
  .footer
    background: $primarycolor.green!important
.create-account-page
  background: $primarycolor.green
  color: $primarycolor.font
  padding-top: 20%
  height: 100vh
  z-index: 999
  position: fixed
  left: 0
  right: 0
  bottom: 0
  top: 0
  .logo
    display: block
    text-align: center
    vertical-align: center
    .logo-img
      width: 120px
      height:156px
  .logo-title
    text-align: center
    height: 60px
    line-height: 60px
    font-size: 42px
    color: $primarycolor.font
  .back-btn
    position: absolute
    top: 10px
    top: calc(10px + constant(safe-area-inset-top))
    top: calc(10px + env(safe-area-inset-top))
    left: 10px
  .footer
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: 99
    // background: $secondarycolor.green
    font-size: 16px
    text-align: center
    padding-top: 8px
    padding-bottom: 8px
    padding-bottom: constant(safe-area-inset-bottom)
    padding-bottom: env(safe-area-inset-bottom)
.width30
  width: 30%

</style>
