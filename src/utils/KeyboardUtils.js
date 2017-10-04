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

export function getDegreeForKey(key) {
  return keyToDegree[key];
}

export function degreeToFrequency(degree) {
  return 440 * (1.059463094359 ** degree);
}
