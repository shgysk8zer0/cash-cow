import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/login-button.js';
import 'https://cdn.kernvalley.us/components/register-button.js';
import 'https://cdn.kernvalley.us/components/logout-button.js';
import 'https://cdn.kernvalley.us/components/youtube-video.js';
import 'https://cdn.kernvalley.us/components/imgur-img.js';
import 'https://cdn.kernvalley.us/components/imgur-gallery/imgur-gallery.js';
import 'https://cdn.kernvalley.us/components/login-form/login-form.js';
import 'https://cdn.kernvalley.us/components/registration-form/registration-form.js';
import {registerServiceWorker} from 'https://cdn.kernvalley.us/js/std-js/functions.js';

document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}
