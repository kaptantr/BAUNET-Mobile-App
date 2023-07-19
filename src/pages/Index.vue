<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <q-pull-to-refresh @refresh="refreshTasks">
      <div class="dashboard q-pa-sm bg-white">
        <q-list id="sortItem" ref="sortItem" bordered class="rounded-borders">
          <q-item-label header @click="slideUpFunc('sort')" style="font-weight:bold;font-family: cursive">SORTIERT:</q-item-label>

          <div class="q-pa-md" style="padding-top:0;padding-bottom:5px">
            <table style="width:100%">
              <tr>
                <td>Erstellungsdatum:</td>
                <td><q-radio dense v-model="sort" val="lastest" label="Letzte" /></td>
                <td><q-radio dense v-model="sort" val="oldest" label="Älteste" /></td>
              </tr>
              <tr>
                <td>Aufgabennname:</td>
                <td><q-radio dense v-model="sort" val="az_name" label="A-Z" /></td>
                <td><q-radio dense v-model="sort" val="za_name" label="Z-A" /></td>
              </tr>
              <tr>
                <td>Vollständiges Prozent:</td>
                <td><q-radio dense v-model="sort" val="az_percent" label="0-100" /></td>
                <td><q-radio dense v-model="sort" val="za_percent" label="100-0" /></td>
              </tr>
            </table>          
          </div>
        </q-list>

        <q-list id="filterItem" ref="filterItem" bordered class="rounded-borders" style="margin-top:10px">
          <q-item-label header @click="slideUpFunc('filter')" style="font-weight:bold;font-family: cursive">FILTER:</q-item-label>

          <div class="q-pa-md" style="padding-top:0;padding-bottom:5px">
            <table style="width:100%">
              <tr>
                <td>Status:</td>
                <td>
                  <select @change="filter" v-model="status" style="width:150px;height:30px">	
                    <option value="" selected>Show All</option>
                    <option value="draft">Draft</option>
                    <option value="assigned">Assigned</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="done">Done</option>
                    <option value="finished">Finished</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Responsibility:</td>
                <td>
                  <select @change="filter" v-model="responsibility" style="width:150px;height:30px">	
                    <option value="" selected>Show All</option>
                    <option value="user">You</option>
                    <option value="other">Others</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>
                  <select @change="filter" v-model="type" style="width:150px;height:30px">	
                    <option value="" selected>Show All</option>
                    <option value="8">Supportticket</option>
                    <option value="9">Team</option>
                    <option value="10">Experten Anfrage Webseite</option>
                    <option value="11">Publishing Experts</option>
                    <option value="13">Projecttask</option>
                    <option value="14">Expertenanfrage</option>
                    <option value="3">Improvement</option>
                    <option value="2">Bug</option>
                    <option value="5">Request</option>
                  </select>
                </td>
              </tr>
            </table>          
          </div>
        </q-list>

        <br>

        <q-list bordered padding class="rounded-borders">
          <q-item-label header>AUFGABEN ({{ count }}):</q-item-label>

          <q-item clickable v-ripple v-for="item in tasksList_" :key="item['X_SECURITY_HASH']" style="width: 95vw;display:block"  class="q-pa-none q-ma-none">
            <q-expansion-item>
              <template v-slot:header>
                <q-item-section avatar top><q-avatar icon="format_indent_increase" text-color="blue-8" /></q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ item['s_NAME'] }}</q-item-label>
                  <q-item-label caption>{{ dateFormat(item['s_CREATED']) }}</q-item-label>
                </q-item-section>                

                 <q-btn dense 
                    :color="item['s_PERCENT']<20 ? 'red' : (item['s_PERCENT']<40 ? 'yellow-8' : (item['s_PERCENT']<60 ? 'orange-8' : (item['s_PERCENT']<80 ? 'green' : 'green-8')))" 
                    icon="equalizer" round class="q-ml-md complete" text-color="grey-2">
                    <q-badge color="accent" floating style="top:-10px">{{ item['s_PERCENT'] }}</q-badge>
                  </q-btn>
              </template>

              <div class="q-pa-md">
                <table style="width:100%">
                  <tr> <td><b>Aufgaben-ID:</b></td> <td>{{ item['s_NUMBER'] }}</td> </tr>
                  <tr> <td><b>Erstellt Von:</b></td> <td>{{ item['s_CREATED_BY'] }}</td> </tr>
                  <tr> <td><b>Priorität:</b></td> <td>{{ convertPriorityToDe(item['s_PRIORITY']) }}</td> </tr>
                  <tr> <td><b>Status:</b></td> <td>{{ convertStatusToDe(item['s_STATUS']) }}</td> </tr>
                  <tr> <td><b>Name:</b></td> <td>{{ item['s_NAME'] }}</td> </tr>
                  <tr> <td><b>Ganztägige:</b></td> <td>{{ item['s_ALL_DAY']=='0' ? 'Nein' : 'Ja' }}</td> </tr>
                  <!-- <tr> <td><b>Erwartetes Ergebnis:</b></td> <td>{{ item['s_DESCRIPTION'] }}</td> </tr> -->
                  <tr> <td><b>Start:</b></td> <td>{{ dateFormat(item['s_START']) }}</td> </tr>
                  <tr> <td><b>Ende:</b></td> <td>{{ dateFormat(item['s_END']) }}</td> </tr>
                  <tr> 
                    <td style="vertical-align: baseline"><b>Zugewiesene Benutzer:</b></td>
                    <td>
                      <ul class="q-pa-none" style="list-style:disc">
                        <!-- <li v-for="(user, index) in item['ASSIGN_USER_NAMES']" :key="index" :style="'padding-left:' + (index*10) + 'px'"> >&nbsp;{{ user }}</li> -->
                        <li v-for="(user, index) in item['ASSIGN_USER_NAMES']" :key="index">{{ user }}</li>
                      </ul>
                    </td> 
                  </tr>
                </table>

                <q-btn dense class="unelevated q-ma-xs" push color="purple" label="Raci" @click="$router.push({ path: 'raci', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="primary" label="ToDos" @click="$router.push({ path: 'todos', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="secondary" label="Medien" @click="$router.push({ path: 'medien', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="blue-8" label="Annotation" @click="$router.push({ path: 'annotations', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="yellow" text-color="black" label="Anmerkungen" @click="$router.push({ path: 'notes', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="brown-5" label="Benutzer" @click="$router.push({ path: 'users', query: { id: item['s_SYSTEM_ID'] }})" />
                <q-btn dense class="unelevated q-ma-xs" push color="deep-orange" label="Mannschaften" @click="$router.push({ path: 'teams', query: { id: item['s_SYSTEM_ID'] }})" />
              </div>
            </q-expansion-item>
          </q-item>
        </q-list>

      </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import * as Helpers from '../boot/helpers.js';
import { LocalStorage } from 'quasar';

export default defineComponent({
  components: {
  },
  name: 'Index',
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      loadedPage: false,
      tasksLoading: false,
      sort: 'lastest',
      status: '',
      responsibility: '',
      type: '',
      count: 0,
      updateTimer: [],
      tasksList: [],
      tasksList_: [],
    }
  },
  setup () {
    return {
      slide: ref(0),
      autoplay: ref(true),
      ilModel: ref(null),
    }
  },
  created() {
    this.requestData('tasks');
  },
  mounted() {
    document.getElementById('sortItem').style.overflow = 'hidden';
    document.getElementById('sortItem').style.height = '45px';
    document.getElementById('filterItem').style.overflow = 'hidden';
    document.getElementById('filterItem').style.height = '45px';
  },
  unmounted() {
    clearInterval(this.updateTimer);
  },
  methods: {
    isset(parent, keyitem, nulled) {
      if(parent == null) { return nulled;}
      return Helpers.isset(parent, keyitem, nulled);
    },
    dateFormat(value) {
      let date = new Date(value).toLocaleDateString(['de-DE'], {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
      return date == 'Invalid Date' ? '----' : date;
    },
    loadedPageFunc() {
      setTimeout(() => { this.loadedPage=true }, 500);
    },
    requestData(itemname) {
      if(itemname == 'tasks') {
        this.tasksLoading = true;
        if(LocalStorage.has('tasksList') && Helpers.tryParseJSON(Helpers.getWithExpiry('tasksList'))) {
          this.tasksList = Helpers.getWithExpiry('tasksList');
          this.tasksList.sort((a,b) =>  new Date(b['s_CREATED']) - new Date(a['s_CREATED']));
          this.tasksList_ = this.tasksList;
          this.tasksLoading = false;
        }
        else {
          LocalStorage.remove('tasksList');
          Helpers.apiRequest('/WebServices/tasks?limit=100&offset=0');
          let timerFunc = setInterval(() => {
            if(LocalStorage.has('tasksList') && Helpers.tryParseJSON(Helpers.getWithExpiry('tasksList'))) {
              this.tasksList = Helpers.getWithExpiry('tasksList');
              this.tasksList.sort((a,b) =>  new Date(b['s_CREATED']) - new Date(a['s_CREATED']));
              this.tasksList_ = this.tasksList;
              this.tasksLoading = false;
              clearInterval(timerFunc);
            }
          }, 1000);
        }
      }
    },
    refreshTasks (done) {
      setTimeout(() => {
          LocalStorage.remove('tasksList');
          Helpers.apiRequest('/WebServices/tasks?limit=100&offset=0');
          let timerFunc = setInterval(() => {
            if(LocalStorage.has('tasksList') && Helpers.tryParseJSON(Helpers.getWithExpiry('tasksList'))) {
              this.tasksList = Helpers.getWithExpiry('tasksList');
              this.tasksList.sort((a,b) =>  new Date(b['s_CREATED']) - new Date(a['s_CREATED']));
              this.tasksList_ = this.tasksList;
              this.tasksLoading = false;
              clearInterval(timerFunc);
              done()
            }
          }, 1000);
      }, 1000);
    },
    slideUpFunc(type) {
      if(type == 'sort') {
        let height = parseInt(document.getElementById('sortItem').style.height.replace('px', ''));
        if(height == 45) {
          const timer = setInterval(function() {
            height +=5;
            document.getElementById('sortItem').style.height = height + 'px';
            if(height >= 135) { clearInterval(timer); }
          }, 10);
        } 
        else if(height == 135) {
          const timer = setInterval(function() {
            height -=5;
            document.getElementById('sortItem').style.height = height + 'px';
            if(height <= 45) { clearInterval(timer); }
          }, 10);
        }
      }
      
      if(type == 'filter') {
        let height = parseInt(document.getElementById('filterItem').style.height.replace('px', ''));
        if(height == 45) {
          const timer = setInterval(function() {
            height +=5;
            document.getElementById('filterItem').style.height = height + 'px';
            if(height >= 160) { clearInterval(timer); }
          }, 10);
        } 
        else if(height == 160) {
          const timer = setInterval(function() {
            height -=5;
            document.getElementById('filterItem').style.height = height + 'px';
            if(height <= 45) { clearInterval(timer); }
          }, 10);
        }
      }
    },
    filter() {
      this.tasksList_ = this.tasksList;
      if(this.status == '' && this.responsibility == '' && this.type == '') { return; }

      if(this.status == '') {
        this.tasksList_ = this.tasksList_.filter(task => { return String(task['s_STATUS']).length > 0 });
      }
      else {
        this.tasksList_ = this.tasksList_.filter(task => { return String(task['s_STATUS']).includes(this.status) });
      }
      if(this.responsibility == '') {
        this.tasksList_ = this.tasksList_.filter(task => { return String(task['s_RESPONSIBILITY']).length > 0 });
      }
      else {
        this.tasksList_ = this.tasksList_.filter(task => { return String(task['s_RESPONSIBILITY']).includes(this.responsibility) });
      }
      if(this.type == '') {
        this.tasksList_ = this.tasksList_.filter(task => { return String(task['s_CLIENT_TASK_TYPE']).length > 0 });
      }
      else {
        this.tasksList_ = this.tasksList_.filter(task => { return task['s_CLIENT_TASK_TYPE'] == this.type });
      }
    },
    convertStatusToDe(text) {
      if(text == 'draft') { return 'Entwurf';}
      if(text == 'assigned') { return 'Zugewiesen';}
      if(text == 'accepted') { return 'Akzeptiert';}
      if(text == 'rejected') { return 'Fertig';}
      if(text == 'done') { return 'Abgelehnt';}
      if(text == 'finished') { return 'Fertig';}

      return text;
    },
    convertPriorityToDe(text) {
      if(text == 'highest') { return 'Höchste';}
      if(text == 'high') { return 'Hoch';}
      if(text == 'medium') { return 'Mittel';}
      if(text == 'low') { return 'Niedrig';}
      if(text == 'lowest') { return 'Am niedrigsten';}

      return text;
    }
  },
  watch: {
      sort(val) {
        if(val == 'az_name') { this.tasksList_.sort((a,b) =>  a['s_NAME'].localeCompare(b['s_NAME'])); }
        if(val == 'za_name') { this.tasksList_.sort((a,b) =>  b['s_NAME'].localeCompare(a['s_NAME'])); }
        if(val == 'az_percent') { this.tasksList_.sort((a,b) =>  a['s_PERCENT'] - b['s_PERCENT']); }
        if(val == 'za_percent') { this.tasksList_.sort((a,b) =>  b['s_PERCENT'] - a['s_PERCENT']); }
        if(val == 'lastest') { this.tasksList_.sort((a,b) =>  new Date(b['s_CREATED']) - new Date(a['s_CREATED'])); }
        if(val == 'oldest') { this.tasksList_.sort((a,b) =>  new Date(a['s_CREATED']) - new Date(b['s_CREATED'])); }
      },
      tasksList_() {
        this.tasksList_.forEach(item => {
          let usernames = String(item['s_USER_NAMES']).split(',');
          let username_ = '';
          item['ASSIGN_USER_NAMES'] = [];
          for (let index = 0; index < usernames.length; index++) {
            username_ += usernames[index];
            if(index % 2 != 0) {
              (item['ASSIGN_USER_NAMES']).push(username_.trim());
              username_ = '';
            }          
          }
        });      
        
        this.count = this.tasksList_.length;
      }
  }
});
</script>

<style scoped>
  button.complete {
    min-width: 28px;
    max-width: 28px;
    min-height: 28px;
    max-height: 28px;
  }
</style>