<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <q-pull-to-refresh @refresh="refreshTasks">
      <div class="dashboard q-pa-sm bg-white">

        <q-list bordered padding class="rounded-borders">
          <q-item-label header>NOTES ({{ count }}):</q-item-label>

          <q-item clickable v-ripple v-for="item in notesList" :key="item['X_SECURITY_HASH']" style="width: 95vw;display:block"  class="q-pa-none q-ma-none">
            <q-expansion-item :default-opened="notesList.length==1 ? true : false">
              <template v-slot:header>
                <q-item-section avatar top><q-avatar icon="local_offer" text-color="blue-8" /></q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ item['s_CLIENT_TASK'] }}</q-item-label>
                  <q-item-label lines="1">{{ dateFormat(item['s_CREATED']) }}</q-item-label>
                </q-item-section>                

                <q-btn dense round flat icon="description">
                  <q-badge color="red" floating transparent>1</q-badge>
                </q-btn>
              </template>

              <div class="q-pa-md">
                <table style="width:100%">
                  <tr> <td><b> Anmerkungen:</b></td> <td>{{ item['s_NOTE'] }}</td> </tr>
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
  name: 'Notes',
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      loadedPage: false,
      notesList: [],
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
      LocalStorage.remove('NotesList');
      Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/notes?limit=100&offset=00', 'Notes');
      let timerFunc = setInterval(() => {
        if(LocalStorage.has('NotesList')) {
          this.loadedPage = false;
          this.notesList = JSON.parse(LocalStorage.getItem('NotesList'));
          clearInterval(timerFunc);
        }
      }, 1000);
    },
    refreshTasks (done) {
      setTimeout(() => {
        LocalStorage.remove('NotesList');
        Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/notes?limit=100&offset=00', 'Notes');
        let timerFunc = setInterval(() => {
          if(LocalStorage.has('NotesList')) {
            this.loadedPage = false;
            this.notesList = JSON.parse(LocalStorage.getItem('NotesList'));
            clearInterval(timerFunc);
            done()
          }
        }, 1000);
      }, 1000);
    },
  },
  watch: {
    notesList() {
      this.count = this.notesList.length;
    }
  }
});
</script>

<style scoped>

</style>