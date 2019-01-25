import {importLink} from '../../js/std-js/functions.js';

export default class HTMLDrawingCanvasElement extends HTMLElement {
	constructor() {
		super();
		this.ctx = null;
		this.classList.add('inline-block');
	}

	async connectedCallback() {
		const shadow = this.attachShadow({mode: 'closed'});
		const link = await importLink('drawing-canvas-template');
		const tmp = link.cloneNode(true);
		shadow.append(...tmp.head.children, ...tmp.body.children);
		[...shadow.querySelectorAll('[data-click]')].forEach(async btn => {
			switch(btn.dataset.click) {
			case 'fill':
				btn.addEventListener('click', async () => this.background = await prompt('What color?'));
				break;
			case 'stroke':
				btn.addEventListener('click', async () => this.color = await prompt('What color?'));
				break;
			case 'save':
				btn.addEventListener('click', async () => await this.save());
				break;
			case 'restore':
				btn.addEventListener('click', async () => await this.restore());
				break;
			case 'erase':
				btn.addEventListener('click', async () => await this.clear());
				break;
			default:
				console.log(btn);
			}
		});
		this.ctx = shadow.querySelector('canvas').getContext('2d', {alpha: this.alpha});
		const canvas = this.canvas;
		canvas.height = this.height;
		canvas.width = this.width;
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.fillStyle = this.fillStyle;
		this.ctx.strokeStyle = this.color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.dispatchEvent(new Event('ready'));

		const ctx = this.ctx;
		let mouse = {x: 0, y: 0};
		function paint() {
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
		}

		this.canvas.addEventListener('mousemove', function(e) {
			mouse.x = e.pageX - this.offsetLeft;
			mouse.y = e.pageY - this.offsetTop;
		}, {
			passive: true,
		});

		this.canvas.addEventListener('mousedown', () => {
			this.ctx.beginPath();
			this.ctx.moveTo(mouse.x, mouse.y);
			this.canvas.addEventListener('mousemove', paint, false);
		}, {
			passive: true,
		});

		this.canvas.addEventListener('mouseup', () => {
			this.canvas.removeEventListener('mousemove', paint, false);
		}, {
			passive: true,
		});
	}


	get canvas() {
		if (this.ctx instanceof CanvasRenderingContext2D) {
			return this.ctx.canvas;
		} else {
			return null;
		}
	}

	get height() {
		return parseInt(this.getAttribute('height'));
	}

	set height(height) {
		this.setAttribute('height', height);
	}

	get width() {
		return parseInt(this.getAttribute('width'));
	}

	set width(width) {
		this.setAttribute('width', width);
	}

	get exportFormat() {
		return this.getAttribute('export-format') || 'image/jpeg';
	}

	set exportFormat(type) {
		this.setAttribute('export-format', type);
	}

	get exportQuality() {
		return parseInt(this.getAttribute('export-quality')) || 1;
	}

	set exportQuality(quality) {
		if (typeof quality === 'number' && ! Number.isNaN(quality) && quality >= 0 && quality <= 1) {
			this.setAttribute('export-quality', quality);
		} else {
			throw new TypeError('Export quality must be a number [0, 1]');
		}
	}

	get color() {
		return this.getAttribute('color') || '#000';
	}

	set color(color) {
		this.setAttribute('color', color);
	}

	get background() {
		return this.getAttribute('background') || '#FFF';
	}

	set background(color) {
		this.setAttribute('background', color);
	}

	get lineWidth() {
		return parseFloat(this.getAttribute('line-width')) || 1;
	}

	set lineWidth(width) {
		if (typeof width === 'number') {
			this.setAttribute('line-width', width);
		}
	}

	get fillStyle() {
		return this.getAttribute('fill-style');
	}

	set fillStyle(style) {
		this.setAttribute('fill-style', style);
	}

	get alpha() {
		return this.hasAttribute('alpha');
	}

	set alpha(enabled) {
		this.toggleAttribute('alpha', enabled);
	}

	get dataURL() {
		return this.ready().then(() => {
			return this.canvas.toDataURL();
		});
	}

	get blob() {
		return this.toBlob();
	}

	get imageData() {
		return this.getImageData();
	}

	async ready() {
		if (! (this.ctx instanceof CanvasRenderingContext2D)) {
			await new Promise(resolve => this.addEventListener('ready', () => resolve(), {once: true}));
		}
	}

	async save() {
		await this.ready();
		this.ctx.save();
	}

	async restore() {
		await this.ready();
		this.ctx.restore();
	}

	async getImageData({x = 0, y = 0, width = this.width, height = this.height} = {}) {
		await this.ready();
		return this.ctx.getImageData(x, y, width, height);
	}

	async toBlob(mimeType = this.exportFormat, quality = this.exportQuality) {
		await this.ready();
		return await new Promise(resolve => this.ctx.canvas.toBlob(resolve, mimeType, quality));
	}

	async fillRect({x = 0, y = 0, height = this.height, width = this.width, color} = {}) {
		await this.ready();
		if (typeof color === 'string') {
			this.color = color;
		}
		this.ctx.fillRect(x, y, width, height);
	}

	async clear({x = 0, y = 0, height = this.height, width = this.width} = {}) {
		await this.ready();
		this.ctx.clearRect(x, y, width, height);
	}

	async attributeChangedCallback(name, oldValue, newValue) {
		await this.ready();
		console.log({name, oldValue, newValue});
		switch(name.toLowerCase()) {
		case 'height':
			this.canvas.height = newValue;
			break;
		case 'width':
			this.canvas.width = newValue;
			break;
		case 'color':
			this.ctx.strokeStyle = newValue;
			break;
		case 'line-width':
			this.ctx.lineWidth = newValue;
			break;
		case 'fill-style':
			this.ctx.fillStyle = newValue;
			break;
		}
	}

	static get observedAttributes() {
		return [
			'color',
			'line-width',
			'fill-style',
			'height',
			'width',
		];
	}
}

customElements.define('drawing-canvas', HTMLDrawingCanvasElement);
