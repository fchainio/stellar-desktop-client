<template>
  <v-card class="pa-2">
    <div class="textcenter ma-4" v-if="loading_flag">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
      <div v-else>
            <v-flex  v-for="item in transactions" :key="item.id" xs12 class="transactions_itemstyle pa-2">
              <v-flex @click="showmoreinformation(item.id)">
                <v-layout>
                  <!-- <v-flex xs7 class="itemstyleo">{{item.temptype==='payment'?$t("Dispatcher"):item.temptype==='change_trust'?$t("ChangeTrust"):item.temptype==='manage_offer'?$t("Trade"):item.temptype==='set_options'?$t("Menu.Settings"):item.temptype==='create_account'?$t("AccountCreated"):item.temptype==='allow_trust'?$t("AllowTrust"):''}}</v-flex> -->
                  <v-flex xs12 class="itemstyleo">TX:{{item.hash}}</v-flex>
                  
                </v-layout>
                <v-layout>
                  <v-flex xs7 class="itemtime">{{getlocaltime_ymd(item.created_at)}}</v-flex>
                  <v-flex xs4 class="itemstylet" v-if="item.memo_type!='none'">{{$t("Memo")}}:{{getTransactionsMiniAddress(item.memo)}}</v-flex>
                  <v-flex xs4 class="itemstylef" v-else>{{$t("Memo")}}:{{$t("No")}}</v-flex>
                  <v-flex xs1 class="itemstyleo textright pr-2">{{$t('Detail')}}</v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
            <v-flex xs12 class="loadmorestyle">
                  <v-btn block flat color="primary" v-if="!loading_flag && !hasnomore"  
                  :loading="loadmore_isflag" @click="loadmore">
                    {{$t('LoadMore')}}
                  </v-btn>
                  <div v-if="hasnomore">{{$t("NoMoreData")}}</div>
            </v-flex>

            <v-dialog v-model="show_flag"  v-if="show_flag" max-width="460" >
              <v-card class="vcardstyle" v-if="this.transactionsOperations.length!=0">
                <div v-if="this.transactionsOperations[0].type=='payment'"><!--接收 Dispatcher-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="closestyle">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="sourceaccount_content_payment">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="operationtypestyle_payment">{{$t("Dispatcher")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex v-if="this.transactionsOperations.memo_type!='none'&&this.tempmemo!=null" class="memostyle_payment">{{$t("Memo")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="memocontentstyle_payment" v-if="this.transactions.memo_type!='none'&&this.tempmemo!=null">{{this.tempmemo}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">
                    <v-flex xs12>
                        <v-layout>
                          <v-flex xs12 class="datetime_payment">{{$t("DateTime")}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="datetimevalue_payment">{{getlocaltime(item.created_at)}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="ptostyle_payment">{{$t("AssetIssuer")}}</v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex xs12 class="ptostyleissuer_payment">{{item.to}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="amount_payment">{{$t("Amount")}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="pamountstyle_add" v-if="item.source_account===item.to||item.to===getaccountaddress()">+{{item.amount}}</v-flex>
                          <v-flex xs12 class="pamountstyle" v-else>-{{item.amount}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="assetcodestyle_payment">{{$t("AssetCode")}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="assetcodevaluestyle_payment">{{item.asset_type==='native'?"XLM":item.asset_type}}</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="txstyle_payment">TX</v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex xs12 class="txcontentstyle_payment">{{item.transaction_hash}}</v-flex>
                        </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
                <div v-if="this.transactionsOperations[0].type=='change_trust'"><!--ChangeTrust 授信-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="chclosestyle">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="chsourceaccount_content">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="itemtype_change_trust">{{$t("ChangeTrust")}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">
                    <v-flex xs12 >
                      <v-layout>
                        <v-flex xs12 class="chitemdatetime">{{$t("DateTime")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemdatetimecontent">{{getlocaltime(item.created_at)}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemassetissurcontent">{{$t("AssetIssuer")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemassetissur">{{item.asset_issuer}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemlimit">{{$t("MaxLimit")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemlimitcontent"  v-if="item.limit==0">{{$t("No")}}</v-flex>
                        <v-flex xs12 class="chitemlimitcontent" v-else >{{getlimitamount(item.limit)}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemassetcode">{{$t("AssetCode")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemassetcodecontent">{{item.asset_code}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemtx">TX</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="chitemtx_content">{{item.transaction_hash}}</v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
                <div v-if="this.transactionsOperations[0].type=='manage_offer'"><!--Trade.Trade                                                                                                                                                                                                                                                                                                                                                                                                                                                     交易-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="manage_setclosestyle">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="manage_sourceaccount">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="manage_langstyle">{{$t("Trade.Trade")}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">                                                                                                                                                                                                                                                                                                                                                                                                                                  
                      <v-flex xs12>
                          <v-layout>
                              <v-flex xs12 class="manage_datetime">{{$t("DateTime")}}</v-flex>
                          </v-layout>
                          <v-layout>
                              <v-flex xs12 class="manage_datetimecontent">{{getlocaltime(item.created_at)}}</v-flex>
                          </v-layout>
                          <v-layout>
                              <v-flex xs12 class="manage_price">{{$t("Trade.Price")}}</v-flex>
                          </v-layout>
                          <v-layout>
                              <v-flex xs12 class="manage_pricecontent">{{getdecimalNumber(item.price)}}</v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex xs12 class="manage_amount">{{$t("Amount")}}</v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex xs12 class="manage_amountvalue">{{item.amount}}</v-flex>
                          </v-layout>
                          <v-layout>
                              <v-flex xs12 class="manage_itemassetcode">{{item.selling_asset_type==='native'?"XLM":item.selling_asset_type}}→{{item.buying_asset_code}}</v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex xs12 class="manage_totalbuy">+{{manage_totalbuy(item.amount,item.price)}}{{item.buying_asset_code}}</v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex xs12 class="manage_tx">TX</v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex xs12 class="manage_tx_content">{{item.transaction_hash}}</v-flex>
                          </v-layout>
                      </v-flex>
                </v-layout>
                </div>
                <div v-if="this.transactionsOperations[0].type=='set_options'"><!--"Menu.Settings":"设置",-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="setclosestyle">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="setsourceaccount">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="setmesstyle">{{$t("Menu.Settings")}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">
                    <v-flex>
                      <v-layout>
                        <v-flex xs12 class="setdatetime">{{$t("DateTime")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="setdatetime_content">{{getlocaltime(item.created_at)}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="setinflation">{{$t("Inflation")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="setinflation_content">{{item.inflation_dest}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="settx">TX</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="settx_content">{{item.transaction_hash}}</v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
                <div v-if="this.transactionsOperations[0].type=='create_account'"><!--"create_account":"创建"-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="createaccountclose">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="createaccountsourcemsgads">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="langstyle">{{$t("CreateAccount")}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">
                    <v-flex>
                      <v-layout>
                        <v-flex class="createaccount_datetime" xs12>{{$t("DateTime")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex class="createaccount_datetime_content" xs12>{{item.created_at}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="createaccount_tx">TX</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="createaccount_tx_content">{{item.transaction_hash}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs6 class="createaccountbalance">+{{item.starting_balance}}</v-flex>
                        <v-flex xs6 class="createaccountbalancemsg">XLM</v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
                <div v-if="this.transactionsOperations[0].type=='allow_trust'"><!--"create_account":"创建"-->
                  <v-layout>
                    <v-flex xs12 @click.stop="dialogclose()" class="createaccountclose">{{$t("Close")}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="allow_trust_sourceaccount">{{getTransactionsMiniAddress(this.transactionsOperations[0].source_account)}}</v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 class="allow_trustlangstyle">{{$t("AllowTrust")}}</v-flex>
                  </v-layout>
                  <v-layout v-for="item in transactionsOperations" :key="item.id" class="transactionsOperationsItem">
                    <v-flex>
                      <v-layout>
                        <v-flex class="allow_trust_datetime" xs12>{{$t("DateTime")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex class="allow_trust_datetime_content" xs12>{{item.created_at}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_assetissuer">{{$t("AssetIssuer")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_assetissuercontent">{{item.asset_issuer}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_assetcode">{{$t("AssetCode")}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_assetcode_content">{{item.asset_code}}</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_tx">TX</v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 class="allow_trust_tx_content">{{item.transaction_hash}}</v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
              </v-card>
              <v-card class="textcenter pa-4" v-else>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-card>
            </v-dialog>
      </div>
  </v-card>
</template>

<script>
  import Toolbar from '@/components/Toolbar'
  import {mapState, mapActions, mapGetters} from 'vuex'
  import Card from '@/components/Card'
  import * as accountapi from '@/api/account'
  import {getAddressByAccountId} from '@/api/federation'
  import Scroll from '@/components/Scroll'
  import { transactionsPage,transactionDetail,transactionOperations } from '@/api/transactions'
  export default {
    data() {
      return {
        transactions:[],
        transactionsInstance:null,
        loadmore_count:0,
        loadmore_isflag:false,
        loading_flag:false,
        hasnomore: false,
        transactionsOperations:[],
        show_flag:false,
        type_again:true,
        tempmemo:null,
      }
    },
    computed: {
      ...mapState({
        account: state => state.accounts.selectedAccount,
        accountData: state => state.account.data,
        assethosts: state => state.asset.assethosts,
        selectedAccountIndex: state => state.accounts.selected,
      }),
      ...mapGetters([
        'balances',
        'paymentsRecords'
      ]),
      
    },
    mounted() {
      this.getTransactionsData()
    },
    methods: {
      ...mapActions([
        'getAccountInfo',
        'getTransactionsPage',
        'selectPayment',
        'cleanAccount'
      ]),
      reload(){
        return new Promise((resolve,reject) => {
          this.getTransactionsData(resolve,reject);
        })
      },
      load() {
        let address = this.account.address
        return Promise.all([this.getAccountInfo(this.account.address)])
      },
      onRefresh: function () {
        console.log('-----on refresh---------')
        return this.load()
      },
      getTransactionsData(resolve,reject){
        console.log('------------get')
        if(this.transactionsInstance){
          this.loadmore_isflag = true;
            this.transactionsInstance.next().then(response=>{
                this.loadmore_isflag = false;
                this.loadmore_count = this.transactions.length
                this.transactions = this.transactions.concat(response.records)
                this.transactions = this.transactions.map(item=> Object.assign({temptype: ''},item))
                this.transactionsInstance = response
                if(this.loadmore_count == this.transactions.length){
                  this.hasnomore = true
                }
                this.transactions.forEach((ele)=>{
                  ele.operations().then((response)=>{
                    ele.temptype = response._embedded.records[0].type
                  })
                })
            }).catch(err=>{
                console.error(err)
            })
        }else{
          this.loading_flag = true
            transactionsPage(this.account.address).then(response=>{
              this.loading_flag = false
                this.transactionsInstance = response
                this.transactions = this.transactions.concat(response.records)
                this.loading_flag  = false
                this.transactions = this.transactions.map(item=> Object.assign({temptype: ''},item))
                this.transactions.forEach((ele)=>{
                  ele.operations().then((response)=>{
                    ele.temptype = response._embedded.records[0].type
                  })
                })
                if(resolve){
                  resolve()
                }
            }).catch(err=>{
              this.$emit('reloadfail')
              this.loading_flag = false
              console.error(err)
              if(reject){
                reject()
              }
            })
        }
      },
      loadmore(){
        this.getTransactionsData()
      },
      getTransactionsMiniAddress(address){
          return accountapi.miniAddress(address)
      },
      showmoreinformation(itemid){
        if(this.type_again){
        this.type_again = false
        console.log(this.transactions)
        this.transactions.forEach((ele)=>{
          if(ele.id===itemid){
                console.log(ele.memo)
                if(ele.memo_type!='none'){
                    this.tempmemo = ele.memo
                }
                console.log(ele.id+"======== "+itemid)
                let newDataObj =null
                transactionOperations(ele.hash)
                  .then(response=>{
                    console.log('---------------------xxxxxxxxxxxxxx---------------')
                    console.log(response)
                    newDataObj = response.records
                    this.transactionsOperations=this.transactionsOperations.concat(newDataObj)
                  })
             }
        })
        setTimeout(() => {
          
        this.show_flag = true
        }, 0)
        setTimeout(()=>{
          this.type_again = true
        },3000)
         }
      },
      dialogclose(){
        this.show_flag = false
        this.transactionsOperations = []
        this.tempmemo=null
      },
      getlimitamount(limitamount){
        let a = (Number(limitamount)).toFixed(2)
        if(a=="0.00"){
          return 0
        }else{
          return a

        }
      },
      getdecimalNumber(itemprice){
        let a = (Number(itemprice)).toFixed(1)
        return a
      },
      getaccountaddress(){
        let address = this.account.address
        return address
      },
      getlocaltime_ymd(itemtime){
        var date1 = new Date(itemtime)
        var date2 = date1.toLocaleDateString().replace(/\//g,"-")
        return date2+" "+date1.toLocaleTimeString()
      },
      getlocaltime(itemtime){
        var date2 = new Date(itemtime)
        return date2.toLocaleString()
      },
      gettemptype(index,itemid){
        console.log(index)
        console.log(itemid)
      },
      manage_totalbuy(itemamount,itemprice){
        console.log(itemamount)
        console.log(itemprice)
        let temp =Number(itemamount)*Number(itemprice)
        console.log(temp)
        return temp
      }
    },
    components: {
      Toolbar,
      Card,
      Scroll,
    }
  }
</script>


<style lang="stylus" scoped>
  @require '~@/stylus/color.styl'
.content
  // font-size:10px
  background:$primarycolor.gray
  // border-radius:5px
  padding:3px 3px 3px 3px

.transactions_itemstyle
  border-bottom:1px solid $primarycolor.gray
  cursor: pointer
  font-size: 14px


.itemtime
  color:$secondarycolor.font
  padding-left:5px
  // text-align:center

.itemstyleo
  color:$secondarycolor.font
  padding-left:5px
.itemstylet
  color:$primarycolor.green
  text-align:left

.itemstyleth
  text-align:left
  color:$secondarycolor.font
.itemstylef
  text-align:left
  color:$secondarycolor.font

.loadmorestyle
    text-align:center
    color:$primarycolor.font

.vcardstyle
  background:$secondarycolor.gray
  padding-top:8px
.createdtimestyle
  color:$secondarycolor.font
  padding-left:8px
.closestyle
  color:$primarycolor.red
  text-align:right
  padding-right:5px
.sourceaccount_title
  color:$secondarycolor.font
  padding:5px 0px 2px 8px

.ptypestyle
  padding-left:8px
  color:$secondarycolor.font
.ptostyle
  color:$secondarycolor.font
  padding-left:8px
  word-break:break-all

.passettypestyle
  // border-top:1px solid $secondarycolor.font
  color:$secondarycolor.font
  text-align:center

.chcreated_at_style
  color:$secondarycolor.font
  padding-left:8px
.chclosestyle
  color:$primarycolor.red
  text-align:right
  padding-right:5px
.chsourceaccount_title
  color:$secondarycolor.font
  padding:5px 0px 2px 8px
  border-top:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
.chsourceaccount_content
  padding:0px 0px 2px 8px
  // border-top:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
  color:$secondarycolor.font
  text-align:center
  word-break:break-all
.itemtype_change_trust
  color:$primarycolor.green
  text-align:center
.chitemdatetime
  color:$primarycolor.green
  padding-left:8px
.chitemdatetimecontent
  color:$primarycolor.font
  padding-left:8px

.chitemtype
  padding-left:8px
  color:$secondarycolor.font
.chitemassetissurcontent
  color:$primarycolor.green
  padding-left:8px
.chitemassetissur
  color:$primarycolor.font
  padding-left:8px
  // text-align:center
  word-break:break-all
.chitemlimit
  color:$primarycolor.green
  padding-left:8px
.chitemlimitcontent
  color:$primarycolor.font
  padding-left:8px
.chitemassetcode 
  color:$primarycolor.green
  padding-left:8px
  font-size:16px
  // text-align:center
.chitemassetcodecontent
  color:$primarycolor.font
  padding-left:8px
.chitemtx
  color:$primarycolor.green
  padding-left:8px
.chitemtx_content
  color:$primarycolor.font
  padding-left:8px
  padding-bottom:8px
  word-break:break-all



.settimestyle
  color:$secondarycolor.font
  padding-left:8px
.setclosestyle
  color:$primarycolor.red
  text-align:right
  padding-right:5px
.setsourceaccount
  text-align:center
  color:$secondarycolor.font
.setdatetime
  color:$primarycolor.green
  padding-left:8px
.setdatetime_content
  color:$primarycolor.font
  padding-left:8px
.setinflation
  color:$primarycolor.green
  padding-left:8px
.setinflation_content
  color:$primarycolor.font
  padding-left:8px
  word-break:break-all
.settx
  color:$primarycolor.green
  padding-left:8px
.settx_content
  color:$primarycolor.font
  padding-left:8px
  word-break:break-all
  padding-bottom:8px
.setmesstyle
  color:$primarycolor.green
  text-align:center
  // padding:5px 0px 5px 8px
  // border-top:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
.setmesadsstyle
  padding:5px 0px 5px 8px
  border-top:1px solid $primarycolor.gray
  border-bottom:1px solid $primarycolor.gray
  border-bottom:1px solid $primarycolor.gray
  color:$secondarycolor.font
  word-break:break-all
.sethomedomainmsg
  padding-left:8px
  color:$secondarycolor.font
  // text-align:center
.sethomedomainmsgt
  color:$secondarycolor.font

.createaccounttime
  padding-left:8px
  color:$secondarycolor.font
.createaccountclose 
  color:$primarycolor.red
  text-align:right
  padding-right:5px
.createaccountsourcemsg
  padding:5px 0px 5px 8px
  color:$secondarycolor.font
  // border-top:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
  // padding-left:8px
.createaccountsourcemsgads
  // border-top:1px solid $primarycolor.gray
  // border-bottom:1px solid $primarycolor.gray
  color:$secondarycolor.font
  text-align:center
.createaccountbalance
  color:$primarycolor.green
  padding-left:8px
.createaccountbalancemsg
  color:$secondarycolor.font


  
.transactionsOperationsItem
  padding-bottom:0px
  border-top:1px solid $primarycolor.gray

.memostyle
  word-break:break-all
  padding:5px 5px 0px 8px 
  // border-top:1px solid $primarycolor.gray
  color:$secondarycolor.font

.langstyle 
  color:$primarycolor.green
  text-align:center
  // padding:5px 0px 5px 8px
  // border:1px solid $primarycolor.gray
.createaccount_datetime
  color:$primarycolor.green
  font-size:16px
  padding-left:8px
.createaccount_datetime_content
  color:$primarycolor.font
  padding-left:8px
  word-break:break-all
.createaccount_tx
  color:$primarycolor.green
  padding-left:8px
.createaccount_tx_content
  color:$primarycolor.font
  padding-left:8px
  padding-bottom:8px
  word-break:break-all


//payment
.sourceaccount_content_payment
  color:$secondarycolor.font
  padding:2px 0px 2px 8px
  word-break:break-all
  text-align:center
.operationtypestyle_payment
  text-align:center
  color:$primarycolor.green
.datetime_payment
  color:$primarycolor.green
  padding-left:5px
.datetimevalue_payment
  color:$primarycolor.font
  padding-left:5px
.ptostyle_payment
  color:$primarycolor.green
  padding-left:5px
.ptostyleissuer_payment
  color:$primarycolor.font
  padding-left:5px
  word-break:break-all
.amount_payment
  color:$primarycolor.green
  padding-left:5px
.pamountstyle_add
  color:$primarycolor.font
  padding-left:5px
.pamountstyle
  color:$primarycolor.font
  padding-left:5px
.assetcodestyle_payment
  color:$primarycolor.green
  padding-left:5px
.assetcodevaluestyle_payment
  color:$primarycolor.font
  padding-left:5px
.txstyle_payment
  padding-left:5px
  color:$primarycolor.green
.txcontentstyle_payment
  padding-left:5px
  padding-bottom:8px
  color:$primarycolor.font
  word-break:break-all
.memostyle_payment
  color:$primarycolor.green
  padding-left:5px
.memostyle_payment
  color:$primarycolor.green
  padding-left:5px
.memocontentstyle_payment
  color:$primarycolor.font
  padding-left:5px
  work-break:break-all

.manage_setclosestyle
  color:$primarycolor.red
  text-align:right
  padding-right:5px
.manage_sourceaccount
  color:$secondarycolor.font
  text-align:center
.manage_langstyle
  color:$primarycolor.green
  text-align:center
.manage_datetime
  color:$primarycolor.green
  padding-left:8px
.manage_datetimecontent
  color:$primarycolor.font
  padding-left:8px
.manage_price
  color:$primarycolor.green
  padding-left:8px
.manage_pricecontent
  color:$primarycolor.font
  padding-left:8px
.manage_amount
  color:$primarycolor.green
  padding-left:8px
  font-size:16px
.manage_amountvalue
  color:$primarycolor.font
  padding-left:8px
.manage_itemtype
  color:$primarycolor.font
  padding:5px 0px 5px 8px
.manage_itemassetissur
  font-size:16px
  color:$primarycolor.font
  padding:5px 0px 5px 0px
.manage_itemlimit
  color:$primarycolor.font
  padding-left:8px
.manage_itemassetcode
  color:$primarycolor.green
  padding-left:8px
.manage_totalbuy
  color:$primarycolor.font
  padding-left:8px
.manage_tx
  color:$primarycolor.green
  padding-left:8px
.manage_tx_content
  color:$primarycolor.font
  padding-left:8px
  padding-bottom:8px
  word-break:break-all

.allow_trust_sourceaccount
  color:$secondarycolor.font
  text-align:center
.allow_trustlangstyle
  color:$primarycolor.green
  text-align:center
.allow_trust_datetime
  color:$primarycolor.green
  padding-left:5px
.allow_trust_datetime_content
  color:$primarycolor.font
  padding-left:5px
  word-break:break-all
.allow_trust_assetissuer
  color:$primarycolor.green
  padding-left:5px
.allow_trust_assetissuercontent
  color:$primarycolor.font
  padding-left:5px
  word-break:break-all
.allow_trust_assetcode
  color:$primarycolor.green
  padding-left:5px
.allow_trust_assetcode_content
  color:$primarycolor.font
  padding-left:5px
  word-break:break-all
.allow_trust_tx
  color:$primarycolor.green
  padding-left:5px
.allow_trust_tx_content
  color:$primarycolor.font
  padding-left:5px
  padding-bottom:8px
  word-break:break-all
.allow_trust_loadmore
  color:$primarycolor.font
  text-align:right

  



</style>
