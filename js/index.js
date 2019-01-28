import './std-js/deprefixer.js';
import './std-js/shims.js';
import '../components/current-year.js';
import '../components/share-button.js';
import '../components/login-form/login-form.js';
import '../components/registration-form/registration-form.js';

document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
