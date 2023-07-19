<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <q-pull-to-refresh @refresh="refreshTasks">
      <div class="dashboard q-pa-sm bg-white">

        <q-list bordered padding class="rounded-borders">
          <q-item-label header>MEDIEN ({{ count }}):</q-item-label>

          <q-item clickable v-ripple v-for="item in mediasList" :key="item['X_SECURITY_HASH']" style="width: 95vw;display:block"  class="q-pa-none q-ma-none">
            <q-expansion-item :default-opened="mediasList.length==1 ? true : false">
              <template v-slot:header>
                <q-item-section avatar top><q-avatar icon="perm_media" text-color="blue-8" /></q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ item['s_MEDIA'] }}</q-item-label>
                  <q-item-label lines="1"><b>Erw: </b>{{ item['s_EXTENSION'] }}</q-item-label>
                </q-item-section>                

                <q-btn dense round flat icon="attach_file">
                  <q-badge color="red" floating transparent>{{ item['s_PHYSICALLY_EXISTS'] ?? '0' }}</q-badge>
                </q-btn>
              </template>

              <div class="q-pa-md">
                <table style="width:100%">
                  <tr> <td><b>Name:</b></td> <td>{{ item['s_MEDIA'] }}</td> </tr>
                  <tr> <td><b>Erweiterung:</b></td> <td>{{ item['s_EXTENSION'] }}</td> </tr>
                  <tr> <td><b>Breite:</b></td> <td>{{ typeof item['s_WIDTH']=='undefined' ? '---' : item['s_WIDTH'] }} px</td> </tr>
                  <tr> <td><b>Höhe:</b></td> <td>{{ typeof item['s_HEIGHT']=='undefined' ? '---' : item['s_HEIGHT'] }} px</td> </tr>
                  <tr> <td><b>Größe:</b></td> <td>{{ typeof item['s_LENGTH']=='undefined' ? '0' : (parseFloat(item['s_LENGTH'])/1000).toFixed(3) }} KB</td> </tr>
                  <tr> <td><b>Hergestellt in:</b></td> <td>{{ dateFormat(item['s_CREATED']) }}</td> </tr>
                  <tr> 
                    <td><b>Dokumentieren:</b></td> 
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
  name: 'Medien',
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      loadedPage: false,
      mediasList: [],
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
      LocalStorage.remove('MediaList');
      Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/medias?limit=100&offset=00', 'Media');
      let timerFunc = setInterval(() => {
        if(LocalStorage.has('MediaList')) {
          this.loadedPage = false;
          this.mediasList = JSON.parse(LocalStorage.getItem('MediaList'));
          clearInterval(timerFunc);
        }
      }, 1000);
    },
    refreshTasks (done) {
      setTimeout(() => {
        LocalStorage.remove('MediaList');
        Helpers.apiSubRequest('/WebServices/tasks/' + this.task_id + '/medias?limit=100&offset=00', 'Media');
        let timerFunc = setInterval(() => {
          if(LocalStorage.has('MediaList')) {
            this.loadedPage = false;
            this.mediasList = JSON.parse(LocalStorage.getItem('MediaList'));
            clearInterval(timerFunc);
            done()
          }
        }, 1000);
      }, 1000);
    },
  },
  watch: {
    mediasList() {
      this.count = this.mediasList.length;
    }
  }
});
</script>

<style scoped>

</style>