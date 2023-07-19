import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar';
//import axios from 'axios';

export default boot(async () => {
  LocalStorage.remove('notificationDatas');
  LocalStorage.remove('started');

  document.addEventListener('deviceready', function () {
    
    /* cordova.plugins.backgroundMode.setDefaults({ silent: true, hidden: true });
    cordova.plugins.backgroundMode.enable();

    cordova.plugins.backgroundMode.wakeUp();
    //cordova.plugins.backgroundMode.unlock();
    cordova.plugins.backgroundMode.disableBatteryOptimizations();

    cordova.plugins.backgroundMode.on('activate', function() {
      setInterval(function () { cordova.plugins.notification.badge.increase(); }, 1000);
      cordova.plugins.backgroundMode.disableWebViewOptimizations();
    });

    cordova.plugins.backgroundMode.on('deactivate', function () {
      cordova.plugins.notification.badge.clear();
    });     */
    
  }, false);

  /* if(!LocalStorage.has('mainDatas')) { 
    axios.get('https://eventnet.one/user/api-main-datas', { })
      .then(response => {
                
          if(response.data != null) { 
            LocalStorage.set('mainDatas', JSON.stringify(response.data));
            LocalStorage.set('started', true);

            if(typeof response.data['bildirims'] !== 'undefined' && response.data['bildirims'] != null) { 
              const bildirim = JSON.parse(JSON.stringify(response.data['bildirims']));  
              cordova.plugins.notification.local.schedule(bildirim, { skipPermission: true });
            } 
          }                     
          
      });
  } */

  /* window.setInterval(() => { 
    axios.get('https://eventnet.one/user/api-main-datas', { })
      .then(response => {
                
          if(response.data != null) { 
            LocalStorage.set('mainDatas', JSON.stringify(response.data));
            LocalStorage.set('started', true);

            if(typeof response.data['bildirims'] !== 'undefined' && response.data['bildirims'] != null) { 
              const bildirim = JSON.parse(JSON.stringify(response.data['bildirims']));  
              cordova.plugins.notification.local.schedule(bildirim);
            }
          }                     
          
      });

  }, 120000); */
})
