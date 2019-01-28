const KEYS = [
	'id',
	'username',
	'created',
	'updated',
	'loggedIn',
];

import HTMLGravatarImageElement from '../components/gravatar-img.js';
import {notify} from './std-js/functions.js';

const ENDPOINT = 'http://localhost:8000';

async function saveCredentials({username, password}) {
	if ('credentials' in navigator && window.PasswordCredential instanceof Function) {
		const creds = new PasswordCredential({
			id: username,
			name: username,
			password: password,
			iconURL: HTMLGravatarImageElement.url({email: username, size: 64}),
		});
		return await navigator.credentials.store(creds);
	}
}

export default class User {
	static get id() {
		return parseInt(sessionStorage.getItem('id'));
	}

	static set id(id) {
		if (typeof id === 'number') {
			sessionStorage.setItem('id', id);
		}
	}

	static get username() {
		return sessionStorage.getItem('username');
	}

	static set username(username) {
		sessionStorage.setItem('username', username);
	}

	static get created() {
		return new Date(sessionStorage.getItem('created'));
	}

	static set created(date) {
		if (! (date instanceof Date)) {
			date = new Date(date);
		}
		sessionStorage.setItem('created', date.toISOString());
	}


	static get updated() {
		return new Date(sessionStorage.getItem('updated'));
	}

	static set updated(date) {
		if (! (date instanceof Date)) {
			date = new Date(date);
		}
		sessionStorage.setItem('updated', date.toISOString());
	}

	static get loggedIn() {
		return ! Number.isNaN(parseInt(sessionStorage.getItem('id')));
	}

	static async login({username, password, store = true, welcome = true}) {
		const url = new URL('login/', ENDPOINT);
		const headers = new Headers({Accept: 'application/json'});
		const body = new FormData();
		body.set('username', username);
		body.set('password', password);

		try {
			const resp = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				body,
				headers,
			});

			if (resp.ok) {
				const detail = await resp.json();

				if (KEYS.every(key => detail.hasOwnProperty(key))) {
					const {id, username, created, updated} = detail;
					User.id = id;
					User.username = username;
					User.created = created;
					User.updated = updated;
					document.dispatchEvent(new CustomEvent('login', {detail}));
					if (store) {
						await saveCredentials({username, password}).catch(console.error);
					}

					if (welcome){
						await notify('Logged in', {
							body: `Welcome back, ${User.username}`,
							icon: HTMLGravatarImageElement.url({email: User.username, size: 64}),
						}).catch(console.error);
					}
					return true;
				}
			} else {
				throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
			}
		} catch(err) {
			console.error(err);
			return false;
		}
	}

	static async register({username, password, store = true, welcome = true}) {
		const body = new FormData();
		body.set('username', username);
		body.set('password', password);
		const headers = new Headers({Accept: 'application/json'});
		const url = new URL('/register/', ENDPOINT);
		try {
			const resp = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				body,
				headers,
			});

			if (resp.ok) {
				const detail = await resp.json();

				if (KEYS.every(key => detail.hasOwnProperty(key))) {
					const {id, username, created, updated} = detail;
					User.id = id;
					User.username = username;
					User.created = created;
					User.updated = updated;
					if (store) {
						await saveCredentials({username, password}).catch(console.error);
					}

					if (welcome) {
						await notify('Registration successful', {
							body: `Welcome, ${User.username}`,
							icon: HTMLGravatarImageElement.url({email: User.username, size: 64}),
						}).catch(console.error);
					}
					document.dispatchEvent(new CustomEvent('login', {detail}));
					return true;
				}
			} else {
				throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
			}
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	static async loginWithCreds() {
		if ('credentials' in navigator && window.PasswordCredential instanceof Function) {
			const creds = await navigator.credentials.get({
				password: true,
				mediation: 'required',
			});
			if (creds instanceof PasswordCredential) {
				return await User.login({
					username: creds.id,
					password: creds.password,
					store: false,
				});
			} else {
				return false;
			}
		}
	}

	static logout() {
		KEYS.forEach(key => sessionStorage.removeItem(key));
		document.dispatchEvent(new Event('logout'));
	}
}