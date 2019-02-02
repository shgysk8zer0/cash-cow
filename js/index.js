import 'https://cdn.chriszuber.com/js/std-js/deprefixer.js';
import 'https://cdn.chriszuber.com/js/std-js/shims.js';
import 'https://cdn.chriszuber.com/components/current-year.js';
import 'https://cdn.chriszuber.com/components/share-button.js';
import 'https://cdn.chriszuber.com/components/login-button.js';
import 'https://cdn.chriszuber.com/components/register-button.js';
import 'https://cdn.chriszuber.com/components/logout-button.js';
import 'https://cdn.chriszuber.com/components/imgur-img.js';
import 'https://cdn.chriszuber.com/components/imgur-gallery/imgur-gallery.js';
import 'https://cdn.chriszuber.com/components/login-form/login-form.js';
import 'https://cdn.chriszuber.com/components/registration-form/registration-form.js';
import {registerServiceWorker} from 'https://cdn.chriszuber.com/js/std-js/functions.js';

document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}
