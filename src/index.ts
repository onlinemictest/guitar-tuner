/**
 * Copyright (C) 2021 Online Mic Test
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license
 */

import { initGetUserMedia } from "./init-get-user-media";

console.log('Licensed under AGPL-3.0: https://github.com/onlinemictest/guitar-tuner')

type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

const middleA = 440;

const SEMI_TONE = 69;
const BUFFER_SIZE = 2 ** 12;
const NOTE_STRINGS: NoteString[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const GUITAR_NOTES = ['E_4', 'B_3', 'G_3', 'D_3', 'A_2', 'E_2'];

const toggleClass = (element: HTMLElement, ...cls: string[]) => {
  element.classList.remove(...cls);

  // Force layout reflow
  void element.offsetWidth;

  element.classList.add(...cls);
};

interface Note {
  value: number,
  index: number,
  name: NoteString
  cents: number
  octave: number,
  frequency: number,
}

function getNote(frequency: number): Note {
  const noteIndex = getNoteIndex(frequency);
  return {
    value: noteIndex % 12,
    index: noteIndex,
    name: NOTE_STRINGS[noteIndex % 12],
    cents: getCents(frequency, noteIndex),
    octave: Math.trunc(noteIndex / 12) - 1,
    frequency: frequency,
  };
}

/**
 * Get musical note from frequency
 */
function getNoteIndex(frequency: number) {
  const note = 12 * (Math.log(frequency / middleA) / Math.log(2))
  return Math.round(note) + SEMI_TONE
}

/**
 * Get the musical note's standard frequency
 */
function getStandardFrequency(note: number) {
  return middleA * Math.pow(2, (note - SEMI_TONE) / 12)
}

/**
 * Get cents difference between given frequency and musical note's standard frequency
 */
function getCents(frequency: number, note: number) {
  return Math.floor((1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2));
}

const floor = (n: number, basis = 1) => Math.floor(n / basis) * basis;
const ceil = (n: number, basis = 1) => Math.ceil(n / basis) * basis;
const round = (n: number, basis = 1) => Math.round(n / basis) * basis;

// @ts-expect-error
Aubio().then(({ Pitch }) => {
  initGetUserMedia();

  if (
    !('WebAssembly' in window) ||
    !('AudioContext' in window) ||
    !('createAnalyser' in AudioContext.prototype) ||
    !('createScriptProcessor' in AudioContext.prototype) ||
    !('trunc' in Math)
  ) {
    return alert('Browser not supported')
  }

  // const wheel = document.getElementById('pitch-wheel-svg') as HTMLImageElement | null;
  // const freqSpan = document.getElementById('pitch-freq')?.querySelector('.freq') as HTMLElement | null;
  // const noteSpan = document.getElementById('pitch-freq')?.querySelector('.note') as HTMLElement | null;
  // const octaveSpan = document.getElementById('pitch-freq')?.querySelector('.octave') as HTMLElement | null;
  const startEl = document.getElementById('audio-start') as HTMLButtonElement;
  const pauseEl = document.getElementById('audio-pause') as HTMLButtonElement;
  const matchCircleR = document.getElementById('match-circle-r') as HTMLDivElement;
  const matchCircleL = document.getElementById('match-circle-l') as HTMLDivElement;
  // const freqTextEl = document.getElementById('pitch-freq-text') as HTMLElement | null;
  // const block2 = document.querySelector('.audio-block-2') as HTMLElement | null;
  // if (!wheel || !freqSpan || !noteSpan || !octaveSpan || !startEl || !pauseEl || !freqTextEl) return;

  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let scriptProcessor: ScriptProcessorNode;
  let pitchDetector: Aubio.Pitch;
  // let stream: MediaStream;

  // const tuneUpText = matchCircleR.innerText;

  pauseEl.addEventListener('click', () => {
    scriptProcessor.disconnect(audioContext.destination);
    analyser.disconnect(scriptProcessor);
    audioContext.close();
    // stream.getTracks().forEach(track => track.stop());

    startEl.style.display = 'block';
    pauseEl.style.display = 'none';
    matchCircleL.style.transform = `translateX(30vw)`;
    matchCircleR.innerText = '';
    matchCircleR.classList.add('with-text');
    matchCircleR.style.color = '';
    // freqTextEl.style.display = 'none';
    // if (block2) block2.style.display = 'block';
    toggleClass(startEl, 'blob-animation');
  })

  startEl.addEventListener('click', () => {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
    pitchDetector = new Pitch('default', BUFFER_SIZE, 1, audioContext.sampleRate);
    pitchDetector.setSilence(-70);

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      // stream = s;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      startEl.style.display = 'none';
      pauseEl.style.display = 'block';
      matchCircleR.innerText = 'Pluck a String';
      matchCircleR.classList.add('with-text');
      // freqTextEl.style.display = 'block';
      // if (block2) block2.style.display = 'none';
      toggleClass(pauseEl, 'shrink-animation');

      matchCircleL.style.visibility = 'visible';

      // console.time('foo');
      let prevCents = -50;
      let prevNotes: string[] = ['', '', ''];

      scriptProcessor.addEventListener('audioprocess', event => {
        // console.timeEnd('foo');
        // console.time('foo');

        const buffer = event.inputBuffer.getChannelData(0)
        const volume = volumeAudioProcess(buffer);
        const frequency = pitchDetector.do(buffer);
        const note = getNote(frequency);

        // const unit = (360 / WHEEL_NOTES);
        // const deg = note.index * unit + (note.cents / 100) * unit;
        // console.log(note.name)

        if (!note.name) return;

        console.log()

        if (prevNotes.every(_ => _ === note.name) && !Number.isNaN(note.cents)) {
          console.log(note);

          // if (prevNote == note.name)
          // const degDiff = Math.trunc(Math.abs(prevDeg - deg));
          // prevDeg = deg;
          // const transformTime = (degDiff + 25) * 15;

          // const centsApprox = round(note.cents, 5);
          const centsApprox = note.cents;
          console.log(centsApprox)

          // const transitionTime = 200 + Math.abs(prevCents - centsApprox) * 10;
          // console.log(transitionTime)

          // matchCircleR.style.transform = `translateX(${note.cents}%)`;
          matchCircleL.style.transition = `transform 200ms ease`;
          matchCircleL.style.transform = `translateX(${centsApprox}%)`;

          matchCircleR.innerText = note.name;
          matchCircleR.classList.remove('with-text');
          if (centsApprox === 0) matchCircleR.style.color = '#fff';
          else matchCircleR.style.color = '#fff8';

          prevCents = centsApprox;
        }

        prevNotes.pop();
        prevNotes.unshift(note.name);

        // freqSpan.innerText = note.frequency.toFixed(1);
        // noteSpan.innerText = note.name;
        // octaveSpan.innerText = note.octave.toString();

        // wheel.style.transition = `transform ${transformTime}ms ease`;
        // wheel.style.transform = `rotate(-${deg}deg)`;
      });
    });
  });
});

function volumeAudioProcess(buf: Float32Array) {
  let bufLength = buf.length;
  let sum = 0;
  let x;

  // Do a root-mean-square on the samples: sum up the squares...
  for (let i = 0; i < bufLength; i++) {
    x = buf[i];
    // if (Math.abs(x) >= clipLevel) {
    //   this.clipping = true;
    //   lastClip = window.performance.now();
    // }
    sum += x * x;
  }

  // ... then take the square root of the sum.
  let rms = Math.sqrt(sum / bufLength);

  // Now smooth this out with the averaging factor applied
  // to the previous sample - take the max here because we
  // want "fast attack, slow release."
  // this.volume = Math.max(rms, this.volume * this.averaging);
  return rms;
}

