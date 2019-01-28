import {importLink} from '../../js/std-js/functions.js';

export default class HTMLLoginFormElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		importLink('login-form-template').then(async tmp => {
			tmp = tmp.cloneNode(true);
			const container = document.createElement('div');
			container.append(...tmp.head.children, ...tmp.body.children);
			this.shadowRoot.append(container);
			const form = this.form;
			container.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

			form.addEventListener('submit', async event => {
				event.preventDefault();
				const body = new FormData(this.form);
				const headers = new Headers({Accept: 'application/json'});
				const url = new URL('http://localhost:8000/login/');
				const resp = await fetch(url, {
					method: 'POST',
					mode: 'cors',
					body,
					headers,
				});

				if (resp.ok) {
					const detail = await resp.json();
					this.form.reset();
					this.dialog.close();
					document.dispatchEvent(new CustomEvent('login',{detail}));
				} else {
					console.error(`${resp.url} [${resp.status} ${resp.statusText}]`);
				}
			});
			form.addEventListener('reset', () => container.querySelector('dialog').close());
			this.dispatchEvent(new Event('ready'));
		});
	}

	get dialog() {
		if (this.shadowRoot.childElementCount === 0) {
			throw new Error('Login form not yet ready');
		} else {
			return this.shadowRoot.querySelector('dialog');
		}
	}

	get form() {
		return this.dialog.querySelector('form');
	}

	async ready() {
		if (this.shadowRoot.childElementCount === 0) {
			await new Promise(resolve => this.addEventListener('ready', () => resolve(), {once: true}));
		}
	}

	async login() {
		await this.ready();
		this.dialog.showModal();
	}
}

customElements.define('login-form', HTMLLoginFormElement);
