<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <q-pull-to-refresh @refresh="refreshTasks">
      <div class="dashboard q-pa-sm bg-white">

        <q-list bordered padding class="rounded-borders">
          <q-item-label header>TODOS ({{ count }}):</q-item-label>

          <q-item clickable v-ripple v-for="item in todosList" :key="item['X_SECURITY_HASH']" style="width: 95vw;display:block"  class="q-pa-none q-ma-none">
            <q-expansion-item :default-opened="todosList.length==1 ? true : false">
              <template v-slot:header>
                <q-item-section avatar top><q-avatar icon="work" text-color="blue-8" /></q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ item['s_CLIENT_TASK'] }}</q-item-label>
                </q-item-section>                

              </template>

              <div class="q-pa-md">
                <table style="width:100%">
                  <tr> <td><b>Klient:</b></td> <td>{{ item['s_CLIENT_TASK'] }}</td> </tr>
                  <tr> <td><b>Aufgabe:</b></td> <td>{{ item['s_CLIENT'] }}</td> </tr>
                  <tr> <td><b>Machen:</b></td> <td>{{ item['s_NAME'] }}</td> </tr>
                  <tr> <td><b>Prozent:</b></td> <td>{{ typeof item['s_PERCENT']=='undefined' ? '0' : item['s_PERCENT'] }}%</td> </tr>
                  <tr> <td><b>Nutzer:</b></td> <td>{{ typeof item['s_USER_NAME']=='undefined' ? '----' : item['s_USER_NAME'] }}</td> </tr>
                  <tr> <td><b>Hergestellt in:</b></td> <td>{{ dateFormat(item['s_CREATED']) }}</td> </tr>
                  <tr> <td><b>Grundkosten, Währung:</b></td> <td>{{ item['s_COST_CURRENCY_BASE'] }}</td> </tr>
                  <tr> <td><b>Basisaufwand, Einheit:</b></td> <td>{{ item['s_EFFORT_UNIT_ACTUAL'] }}</td> </tr>
                  <tr> 
                    <td><b>Medien:</b></td> 
                    <td>
                      <a href="#" v-if="typeof item['f_MEDIA']=='undefined'">Kein Dokument</a>
                      <a :href="'https://stage.do-it.one/modules/tasks/tasks/gallery.file?media=' + item['f_MEDIA']" target="blank_" v-if="typeof item['f_MEDIA']!='undefined'">Dokument Anzeige</a>
                    </td> 
                  </tr>
                </table>
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
  name: 'Todos',
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      loadedPage: false,
      todosList: [],
      task_id: this.$route.query.id ?? 0,
      count: 0,
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
    this.requestData();
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
    requestData() {
      if(this.task_id == 0) { return; }
      this.loadedPage = true;
      LocalStorage.remove('TodoList');
      Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/todos?limit=100&offset=00', 'Todo');
      let timerFunc = setInterval(() => {
        if(LocalStorage.has('TodoList')) {
          this.loadedPage = false;
          this.todosList = JSON.parse(LocalStorage.getItem('TodoList'));
          clearInterval(timerFunc);
        }
      }, 1000);
    },
    refreshTasks (done) {
      setTimeout(() => {
        LocalStorage.remove('TodoList');
        Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/todos?limit=100&offset=00', 'Todo');
        let timerFunc = setInterval(() => {
          if(LocalStorage.has('TodoList')) {
            this.loadedPage = false;
            this.todosList = JSON.parse(LocalStorage.getItem('TodoList'));
            clearInterval(timerFunc);
            done()
          }
        }, 1000);
      }, 1000);
    },
  },
  watch: {
    todosList() {
      this.count = this.todosList.length;
    }
  }
});
</script>

<style scoped>

</style>