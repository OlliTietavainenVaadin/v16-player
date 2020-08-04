import {css, customElement, html, LitElement, property} from 'lit-element';

import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-grid/all-imports.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@vaadin/vaadin-lumo-styles/all-imports.js';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout.js';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout.js';
import * as Tone from "tone";

import * as DataEndpoint from '../../generated/DataEndpoint';
import {EndpointError} from '@vaadin/flow-frontend/Connect';

@customElement('player-view')
export class PlayerView extends LitElement {
    @property({type: Array})
    private notes: any[] = [];

    @property()
    private initialized: boolean = false;

    @property()
    private recorded: string[] = [];

    private recording: boolean = false;
    private notesByKey: Map<string, string> = new Map();
    private mousedown: boolean = false;

    @property()
    synth!: Tone.Synth;

    static get styles() {
        return [
            css`
        :host {
          display: block;
          height: 100%;
        }
        .note {
          background: white;
          color: black;
          height:14rem;
          font-size: 12px;
          text-align: center;
          border-left:1px solid #999;
          border-bottom:1px solid #999;
          width: 100px;
          user-select: none;
        }
        
        .sharp {
          background: black;
          font-size: 12px;
          color: white;
          text-align: center;
          border-left:1px solid #999;
          border-bottom:1px solid #999;
          width: 50px;
          height:8rem;
          margin-left:-25px;
          margin-right:-26px;
          user-select: none;          
          position: relative;
        }
        
        .keyboard {
          background: gray;
          display: flex;
          flex-direction: row;
          position: relative;
          height: 100%;
        }
        
        .record {
            width: 800px;
            height: 5em;
        }
      `,
        ];
    }

    render() {
        return html`
    <vaadin-vertical-layout>
        <div tabindex="0" class="keyboard" @keyup="${this.keyup}" @keydown="${this.keydown}">
            ${this.notes.map(item => this.createTemplate(item.note, item.key))}
        </div>
        <vaadin-horizontal-layout>
            <vaadin-button @click="${this.startRecording}">start recording</vaadin-button>
            <vaadin-button @click="${this.stopRecording}">stop recording</vaadin-button>
        </vaadin-horizontal-layout>
        <div>
          <h3>Record</h3>
          <textarea class="record" .value=${this.recorded.join(", ")}></textarea>
        </div>
        <vaadin-horizontal-layout>
            <vaadin-button @click="${this.clear}">Clear record</vaadin-button>
            <vaadin-button @click="${this.save}">Save record to server</vaadin-button>
            <vaadin-button @click="${this.load}">Load record from server</vaadin-button>
            <vaadin-button @click="${this.playback}">Playback</vaadin-button>
        </vaadin-horizontal-layout>
        ${this.initialized ?
            html`` :
            html`<div>(please click on keyboard to activate AudioContext)</div>`}
        <br/>
    </vaadin-vertical-layout>
    `;
    }

    public playback() {
        const now = Tone.now();
        for (let i = 0; i < this.recorded.length; i++) {
            let note = this.recorded[i];
            this.synth.triggerAttackRelease(note, "8n",now + (i * 0.5));
        }
    }

    public clear() {
        this.recorded = [];
    }

    private async save() {
        await DataEndpoint.save(this.recorded);
    }

    private async load() {
        this.recorded = await DataEndpoint.load();
    }

    public startRecording() {
        this.recording = true;
    }

    public stopRecording() {
        this.recording = false;
    }

    public createTemplate(item: any, key: string) {
        let clazz = "note";
        if (item.indexOf("#") >= 0) {
            clazz = "note sharp"
        }
        return html`
          <div class="${clazz}" id="${item}" @mousedown="${this.mousedowned}" 
          @mouseup="${this.mouseupped}" @mouseenter="${this.mouseentered}" @mouseleave="${this.mouseleft}">
             ${item}<br/> (${key})</div>
          `
    }

    constructor() {
        super();
    }

    private mouseupped() {
        if (this.mousedown) {
            this.mousedown = false;
            this.stop();
        }
    }

    private mouseleft() {
        if (this.mousedown) {
            this.stop();
        }
    }

    private mouseentered(event: any) {
        if (this.mousedown) {
            let id = event.target.id;
            let note = id;
            this.playNote(note);
        }
    }

    private stop() {
        this.synth.triggerRelease();
    }

    private keydown(e: KeyboardEvent) {
        let key: string = <string>(this.notesByKey.has(e.key) ? this.notesByKey.get(e.key) : "")
        if (key === "") {
            return;
        }
        this.playNote(key, "4n");
    }

    private keyup() {
        this.stop();
    }

    private mousedowned(e: any) {
        if (!this.initialized) {
            this.initialized = true;
        }
        this.mousedown = true;
        let id = e.target.id;
        let note = id;

        this.playNote(note);
    }

    private playNote(note: string, duration?: string) {
        if (duration != null) {
            this.synth.triggerAttackRelease(note, duration);
        } else {
            this.synth.triggerAttack(note);
        }
        if (this.recording) {
            this.recorded = [...this.recorded, note];
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        try {
            const data = await DataEndpoint.getKeys();
            this.notes = data;
            data.forEach(item => this.notesByKey.set(item.key, item.note));
        } catch (error) {
            if (error instanceof EndpointError) {
                console.error("Endpoint error:", error);
            } else {
                console.error(error);
            }
        }
        this.synth = new Tone.Synth().toDestination();

    }
}
