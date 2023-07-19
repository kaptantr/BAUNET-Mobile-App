/* eslint-disable vue/multi-word-component-names */
<template>
  <q-page class="bg-grey-2 q-pt-xs" style="margin-top:-4px">
    
    <div class="row q-ma-xs main-loading" v-if="loadedPage">
      <q-spinner-puff class="absolute-center" color="primary" size="2.5em" style="margin-top: -25px" />
    </div>
    
    <div class="row q-col-gutter-sm q-ma-xs">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">Mein Trainer Profil</div>
              <div class="text-h5 q-mt-sm q-mb-xs">{{ kullanici.adi }} {{ kullanici.soyadi }}</div>
              <div class="text-caption text-grey">
                {{ kullanici.hakkinda }}
              </div>
            </q-card-section>

            <q-card-section class="col-5 flex flex-center"> <q-img class="rounded-borders" :src="kullanici.resim" /> </q-card-section></q-card-section>

          <q-separator/>

          <q-card-section> {{ kullanici.aciklama }} </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="kullanici.adi" label="Vorname" />
              <q-input filled v-model="kullanici.soyadi" label="Nachname" />
              <q-input filled v-model="kullanici.aciklama" label="Beschreibung" />
              <q-input filled v-model="kullanici.telefon" label="Telefon" />
              <q-input filled v-model="kullanici.email" label="Email" />
              <q-input filled v-model="kullanici.kocu" label="Trainer seit" />
              <q-input filled v-model="kullanici.pdf" label="Pdf" />
              <q-input filled v-model="kullanici.video" label="Video" />
              <q-input filled v-model="kullanici.deneyim" label="Berufserfahrung" />
              <q-input filled v-model="kullanici.uzmanlik" label="Fachkompetenz" />
              <q-input filled v-model="kullanici.egitim" label="Ausbildung" />
              <q-input filled v-model="kullanici.yeterlilik" label="Branchenkompetenz" />
              <q-input filled v-model="kullanici.projeler" label="Schlüsselprojekte" />
              <q-input filled v-model="kullanici.gereksinim" label="Mein Schulungsanspruch" />
              <q-input filled v-model="kullanici.hakkinda" label="Was man über mich wissen sollte" />

              <div>
                <q-btn label="Ändern" type="submit" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import * as Helpers from '../boot/helpers.js';
import { LocalStorage } from 'quasar';

export default defineComponent({
  components: {
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Account',
  data() {
    return {
      apiUrl: '',
      loadedPage: false,
      kullanici: {
        adi: 'Trainer ist',
        soyadi: 'anbieter2',
        aciklama: 'bcvdfg',
        telefon: '',
        email: '',
        kocu: '(nicht gesetzt)',
        resim: 'https://eventnet.one/media/image/O4GotimIzm9t0ETxlCjpQXvoDqV8yO5i.png',
        pdf: '(nicht gesetzt)',
        video: '(nicht gesetzt)',
        deneyim: 'a',
        uzmanlik: 'b',
        egitim: 'c',
        yeterlilik: 'd',
        projeler: 'e',
        gereksinim: 'f',
        hakkinda: 'g',
      },	 
    }
  },
  created () {
    LocalStorage.remove('Authorization');    
    document.location.href = '/';
  },
  setup () {
    return {

    }
  },
  methods: {
    isset(parent, keyitem, nulled) {
      if(parent == null) { return nulled;}
      return Helpers.isset(parent, keyitem, nulled);
    },
  },
  watch: {

  }
});
</script>

<style scoped>
  .swiper.swiper-initialized.haber-slider .slide-content {
    left: 0;
    font-size: small;
    color: #ffffff;
    background-color: #00000077;
    position: absolute;
    bottom: 5px;
    padding: 5px 10px;
    width: auto;
}
</style>