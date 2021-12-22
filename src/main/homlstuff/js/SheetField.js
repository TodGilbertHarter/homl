/*
Sheetfield implements a web component which will bind to a field in a character object via knockout. This allows us to map a character
into a character sheet, and do two-way updates.
*/
const template = document.createElement('template');
template.innerHTML = `
<label id='label'></label><input id='input' type='text'>`;

class SheetField extends HTMLElement {
    constructor() {
        super();
        const content = template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
    }
    
    connectedCallback() {
        const value = this.getAttribute('value');
        const n = this.getAttribute('name');
        const style = this.getAttribute('style');
        const id = this.getAttribute('id');
        const input = this.shadowRoot.getElementById('input');
        input.setAttribute('data-bind','value: '+id);
        input.setAttribute('style',style);
        input.setAttribute('value',value);
        input.setAttribute('name',n);
        const ltext = this.getAttribute('label');
        const label = this.shadowRoot.getElementById('label');
        label.innerHTML = ltext;
    }
}

window.customElements.define('sheet-field',SheetField);
