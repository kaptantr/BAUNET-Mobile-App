<template>
  <div class="row q-ma-xs main-loading" v-if="started">
    <q-spinner-ball class="absolute-center" color="primary" size="4em" style="margin-top: -25px" />
  </div>

  <q-layout view="lHh Lpr lFf" v-if="tokenlogined">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu"  @click="toggleLeftDrawer" />
        <q-toolbar-title>Baunet Task Management</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="row justify-center q-pa-xs">
        <div class="col-9" style="margin-top: 10px">
          <q-img class="leftbar-logo" src="../images/baunet-logo.jpg" native-context-menu />
          <div style="display: block;text-align: center;font-size: 10px;">ver: 2.4.4</div>
        </div>
      </div>

      <q-list style="margin-top: 30px">
        <q-item clickable tag="a" @click="menuItemClick('/')">
          <q-item-section avatar><q-icon :name="'home'" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Aufgaben') }}</q-item-label>
            <q-item-label caption> </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" @click="menuItemClick('/tasks')">
          <q-item-section avatar><q-icon :name="'auto_awesome'" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Überblick') }}</q-item-label>
            <q-item-label caption> </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" @click="menuItemClick('/projects')">
          <q-item-section avatar><q-icon :name="'table_view'" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Projekte') }}</q-item-label>
            <q-item-label caption> </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" @click="menuItemClick('/logout')">
          <q-item-section avatar><q-icon :name="'account_circle'" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Logout') }}</q-item-label>
            <q-item-label caption> </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

     <q-footer class="main-footer fixed-bottom bg-white">
      <q-toolbar>
        <div class="text-center"
          :class="isActiveTab('/') ||
            isActiveTab('/raci') ||
            isActiveTab('/todos') ||
            isActiveTab('/medien') ||
            isActiveTab('/notes') ||
            isActiveTab('/users') ||
            isActiveTab('/teams') ||
            isActiveTab('/annotations')">
          <q-btn flat icon="list_alt" @click="menuItemClick('/')" />
          <p>{{ $t('Aufgaben') }}</p>
        </div>
        <q-space />
        <div class="text-center" :class="isActiveTab('/details')">
          <q-btn flat icon="gradient" @click="menuItemClick('/details')" />
          <p>{{ $t('Überblick') }}</p>
        </div>
        <q-space />
        <div class="text-center" :class="isActiveTab('/projects')">
          <q-btn flat icon="style" @click="menuItemClick('/projects')" />
          <p>{{ $t('Projekte') }}</p>
        </div>
        <q-space />
        <div class="text-center" :class="isActiveTab('/logout')">
          <q-btn flat icon="account_box" @click="menuItemClick('/logout')" />
          <p>{{ $t('Logout') }}</p>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>

  <q-layout view="lHh Lpr lFf" v-if="!tokenlogined">
    <q-page class="window-height window-width row justify-center items-center" style="background: linear-gradient(#8274c5, #5a4a9f)">
      <div class="column q-pa-lg">
        <div class="row">
          <q-card square class="shadow-24" style="width: 90vw">
            <q-card-section class="bg-deep-purple-7">
              <h4 class="text-h5 text-white q-my-md">{{ this.register ? 'Sign Up' : 'Sign In' }}</h4>
            </q-card-section>
            <q-card-section>
              <q-fab color="primary" @click="switchTypeForm" icon="add" class="absolute" style="top: 0; right: 12px; transform: translateY(-50%)">
                <q-tooltip> New User Register </q-tooltip>
              </q-fab>
              <q-form class="q-px-sm q-pt-xl">
                <q-input ref="email" square clearable v-model="email" type="email" lazy-rules :rules="[this.required, this.isEmail, this.short]" label="Email">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input ref="username" v-if="register" square clearable v-model="username" lazy-rules :rules="[this.required, this.short]" type="username" label="Username">
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <q-input ref="password" square clearable v-model="password" :type="passwordFieldType" lazy-rules :rules="[this.required, this.short]" label="Password">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                  </template>
                </q-input>
                <q-input ref="repassword" v-if="register" square clearable v-model="repassword" :type="passwordFieldType" lazy-rules :rules="[this.required, this.short, this.diffPassword]" label="Repeat Password">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                  </template>
                </q-input>
                </q-form>
              </q-card-section>

              <q-card-actions class="q-px-lg row justify-center items-center">
                <q-btn unelevated size="lg" color="secondary" @click="submit" lass="full-width text-white" :disabled="this.logining">
                  {{ this.register ? 'Save' : 'Login' }}
                  <q-inner-loading showing v-if="this.logining" color="primary"></q-inner-loading>
                </q-btn>
              </q-card-actions>
              <q-card-section v-if="!register" class="text-center q-pa-sm">
                <p class="text-grey-6">Forgot password?</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import * as Helpers from '../boot/helpers.js';
import { LocalStorage, Notify } from 'quasar';
//import axios from 'axios';

const md5 = require('md5');

export default defineComponent({
  name: 'MainLayout',
  components: {
  },
  data() {
    return {
      apiUrl: 'https://stage.do-it.one/WebServices',
      started: false,
      tokenlogined: false,
      logining: false,
      urlname: '',
      email: '',
      username: '',
      password: '',
      repassword: '',
      register: false,
      passwordFieldType: 'password',
      visibility: false,
      visibilityIcon: 'visibility',
    }
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  created() {
    setInterval(() => {
      if(LocalStorage.has('Authorization') && LocalStorage.getItem('Authorization').indexOf('Bearer ') >= 0
        && Helpers.getWithExpiry('Authorization').replace('Bearer ', '').length == 128) {
          if(!this.tokenlogined) { this.tokenlogined = true; }
          if(this.logining) { this.logining = false; }
      }
      else {
        this.tokenlogined = false;
      }
    }, 1000);
  },
  mounted() {
    this.urlname = this.$route.path;
  },

  methods:{
    menuItemClick(path) {
      if(path == '/logout') {
        LocalStorage.remove('Authorization');
        this.tokenlogined = false;
      }

      this.urlname = path;
      this.$router.push(path);
    },
    isActiveTab(path) {
      return this.urlname == path ? 'active' : '';
    },
    isset(parent, keyitem, nulled) {
      if(parent == null) { return nulled;}
      return Helpers.isset(parent, keyitem, nulled);
    },
    required(val) {
      return (val && val.length > 0) || 'Alan doldurulmalıdır';
    },
    diffPassword(val) {
      return true;
      const val2 = this.$refs.password.value;
      return (val && val === val2) || 'Şifre eşleşmiyor!';
    },
    short(val) {
      return (val && val.length > 3) || 'Değer çok kısa';
    },
    isEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Lütfen geçerli eposta adresini giriniz';
    },
    submit() {
      if (this.register) {
        this.$refs.email.validate();
        this.$refs.username.validate();
        this.$refs.password.validate();
        this.$refs.repassword.validate();
        Notify.create({
          icon: 'done',
          color: 'positive',
          message: 'Register successfuly!',
        });
        setTimeout(() => this.register = false, 1000);
      }
      else {
        this.$refs.email.validate();
        this.$refs.password.validate();
      }

      if (!this.register) {
        if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
          this.login();
        }
      }
    },
    switchTypeForm() {
      this.register = !this.register;
    },
    switchVisibility() {
      this.visibility = !this.visibility;
      this.passwordFieldType = this.visibility ? 'text' : 'password';
      this.visibilityIcon = this.visibility ? 'visibility_off' : 'visibility';
    },
    login() {
      this.logining = true;
      Helpers.apiLogin(this.apiUrl, encodeURIComponent(this.email), md5(this.password));
    },
  },
  watch: {

  }
});
</script>

<style scoped>
  div.streaming-button {
    font-size: 9px;
    font-weight: bold;
    background-color: #cd0707;
    padding: 5px;
    margin-right: -5px;
    border-radius: 5px;
  }
</style>
