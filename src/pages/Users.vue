<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <q-pull-to-refresh @refresh="refreshTasks">
      <div class="dashboard q-pa-sm bg-white">

        <q-list bordered padding class="rounded-borders">
          <q-item-label header>USERS ({{ count }}):</q-item-label>

          <q-item clickable v-ripple v-for="item in usersList" :key="item['X_SECURITY_HASH']" style="width: 95vw;display:block"  class="q-pa-none q-ma-none">
            <q-expansion-item :default-opened="usersList.length==1 ? true : false">
              <template v-slot:header>
                <q-item-section avatar top><q-avatar icon="person" text-color="blue-8" /></q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ item['s_USER_NAME'] }}</q-item-label>
                  <q-item-label lines="1">{{ item['s_USER_EMAIL'] }}</q-item-label>
                </q-item-section>                

              </template>

              <div class="q-pa-md">
                <table style="width:100%">
                  <tr> <td><b>Aufgabennname:</b></td> <td>{{ item['s_CLIENT_TASK'] }}</td> </tr>
                  <tr> <td><b>Aufgabe:</b></td> <td>{{ item['s_CLIENT'] }}</td> </tr>
                  <tr> <td><b>Name/Nachname:</b></td> <td>{{ item['s_USER_FIRSTNAME'] + ' ' + item['s_USER_LASTNAME'] }}</td> </tr>
                  <tr> <td><b>Rolle:</b></td> <td>{{ item['s_ROLE'] }}</td> </tr>
                  <tr> <td><b>Erstellt:</b></td> <td>{{ item['s_CREATED_BY'] }}</td> </tr>
                  <tr> <td><b>Erstellter Benutzer:</b></td> <td>{{ item['s_CREATED'] }}</td> </tr>
                  <tr> <td><b>Aktualisierter:</b></td> <td>{{ item['s_EDITED_BY'] }}</td> </tr>
                  <tr> <td><b>Aktualisierter Benutzer:</b></td> <td>{{ item['s_EDITED'] }}</td> </tr>
                  <tr> <td><b>Quelle:</b></td> <td>{{ item['s_SOURCE'] }}</td> </tr>
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
  name: 'Users',
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      loadedPage: false,
      usersList: [],
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
      LocalStorage.remove('UsersList');
      Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/users?limit=100&offset=00', 'Users');
      let timerFunc = setInterval(() => {
        if(LocalStorage.has('UsersList')) {
          this.loadedPage = false;
          this.usersList = JSON.parse(LocalStorage.getItem('UsersList'));
          clearInterval(timerFunc);
        }
      }, 1000);
    },
    refreshTasks (done) {
      setTimeout(() => {
        LocalStorage.remove('UsersList');
        Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/users?limit=100&offset=00', 'Users');
        let timerFunc = setInterval(() => {
          if(LocalStorage.has('UsersList')) {
            this.loadedPage = false;
            this.usersList = JSON.parse(LocalStorage.getItem('UsersList'));
            clearInterval(timerFunc);
            done()
          }
        }, 1000);
      }, 1000);
    },
  },
  watch: {
    usersList() {
      this.count = this.usersList.length;
    }
  }
});
</script>

<style scoped>

</style>