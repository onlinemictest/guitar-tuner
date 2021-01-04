export type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export const middleA = 440;

export const SEMI_TONE = 69;
export const NOTE_STRINGS: NoteString[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Note {
  value: number,
  index: number,
  name: NoteString
  cents: number
  octave: number,
  frequency: number,
}

export function getNote(frequency: number): Note {
  const noteIndex = getNoteIndex(frequency);
  // console.log(`${NOTE_STRINGS[noteIndex % 12]}_${Math.floor(noteIndex / 12) - 1}`, noteIndex)
  return {
    value: noteIndex % 12,
    index: noteIndex,
    name: NOTE_STRINGS[noteIndex % 12],
    cents: getCents(frequency, noteIndex),
    octave: Math.floor(noteIndex / 12) - 1,
    frequency: frequency,
  };
}

/**
 * Get musical note from frequency
 */
export function getNoteIndex(frequency: number) {
  const note = 12 * (Math.log(frequency / middleA) / Math.log(2))
  return Math.round(note) + SEMI_TONE
}

/**
 * Get the musical note's standard frequency
 */
export function getStandardFrequency(note: number) {
  return middleA * (2 ** ((note - SEMI_TONE) / 12));
}

/**
 * Get cents difference between given frequency and musical note's standard frequency
 */
export function getCents(frequency: number, note: number) {
  return Math.floor((1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2));
}