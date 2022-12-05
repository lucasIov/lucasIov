/*
this code is the view mode of the application
  the editor function are not included in this file
*/

class Presentation {
	constructor(element) {
		this.element = element;
		// ex: <Presentation loop startSlide="2" next="Space; ArrowRight; ArrowDown; click" prev="ArrowLeft; ArrowUp;">
		this.option = {
			loop: this.element.attributes["loop"] ? true : false,
			startSlide: this.element.attributes["startSlide"] ? parseInt(this.element.attributes["startSlide"].value) : 0,
			next: this.element.attributes["next"] ? this.element.attributes["next"].value.split(';').map(s => s.trim()) : [],
			prev: this.element.attributes["prev"] ? this.element.attributes["prev"].value.split(';').map(s => s.trim()) : []
		}
		this.slides = [];
		this.currentSlide = (this.option.startSlide || 0);
		this.edit = false;

		// Create slides
		let slides = element.querySelectorAll('Slide');
		for (let slide of slides) this.slides.push(slide);

		this.goTo(this.currentSlide);
		// add controls
		window.addEventListener('keydown', e => {
			if (this.edit === true) return;
			if (this.option.next.includes(e.code)) this.next();
			if (this.option.prev.includes(e.code)) this.prev();
		});
		if (this.option.next.includes('click')) this.element.addEventListener('click', () => { if (this.edit !== true) this.next() });
	}

	goTo(Index) {
		if (Index < 0 || Index >= this.slides.length) return;
		(this.slides[this.currentSlide] || {className:""}).className = 'disappear';
		this.currentSlide = Index;
		this.slides[this.currentSlide].className = 'appear';
		this.element.querySelectorAll('img').forEach(img => {
			if (img.attributes["animate"]) {
				img.style.top = `-${( this.currentSlide / this.slides.length ) * ( img.height - window.innerHeight )}px`;
			}
		});
		if (this.edit) this.editor_update();
		return this.currentSlide;
	}

	next() { return this.goTo(this.currentSlide >= this.slides.length - 1 ? ( this.option.loop ? 0 : this.currentSlide ) : this.currentSlide + 1); }
	prev() { return this.goTo(this.currentSlide <= 0 ? ( this.option.loop ? this.slides.length -1 : this.currentSlide ) : this.currentSlide - 1); }
}