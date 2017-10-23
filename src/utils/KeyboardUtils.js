export const keyToDegree = {
  'q': -9,
  '2': -8,
  'w': -7,
  '3': -6,
  'e': -5,
  'r': -4,
  '5': -3,
  't': -2,
  '6': -1,
  'y': 0,  // A 440
  '7': 1,
  'u': 2,
  'i': 3,
  '9': 4,
  'o': 5,
  '0': 6,
  'p': 7,
  '[': 8,
  '=': 9,
  ']': 10,
};

export const degreeToNote = {
  '-9': 'C -1',
  '-8': 'C# -1',
  '-7': 'D -1',
  '-6': 'D# -1',
  '-5': 'E -1',
  '-4': 'F -1',
  '-3': 'F# -1',
  '-2': 'G -1',
  '-1': 'G#',
  '0': 'A',
  '1': 'A#',
  '2': 'B',
  '3': 'C',
  '4': 'C#',
  '5': 'D',
  '6': 'D#',
  '7': 'E',
  '8': 'F',
  '9': 'F#',
  '10': 'G',
};

export const keyToPosition = {
  'q': 0,
  '2': 0.5,
  'w': 1,
  '3': 1.5,
  'e': 2,
  'r': 3,
  '5': 3.5,
  't': 4,
  '6': 4.5,
  'y': 5,  // A 440
  '7': 5.5,
  'u': 6,
  'i': 7,
  '9': 7.5,
  'o': 8,
  '0': 8.5,
  'p': 9,
  '[': 10,
  '=': 10.5,
  ']': 11,
};

export function getDegreeForKey(key) {
  return keyToDegree[key];
}

export function degreeToFrequency(degree) {
  return 440 * (1.059463094359 ** degree);
}
