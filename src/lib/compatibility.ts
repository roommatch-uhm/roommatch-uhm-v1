// Top 5 preferences to weight more heavily
const TOP_PREFERENCES = ['clean', 'budget', 'social', 'study', 'sleep'];

// Assign weights (top 5 = 2, others = 1)
function getWeight(key: string) {
  return TOP_PREFERENCES.includes(key) ? 2 : 1;
}

type ProfileAnswers = {
  [key: string]: string | number | null | undefined;
};

export function calculateCompatibility(
  userA: ProfileAnswers,
  userB: ProfileAnswers
): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  for (const key of Object.keys(userA)) {
    if (userB[key] !== undefined && userA[key] !== undefined) {
      const weight = getWeight(key);
      totalWeight += weight;

      // For numbers (like budget), allow some tolerance
      if (typeof userA[key] === 'number' && typeof userB[key] === 'number') {
        const diff = Math.abs((userA[key] as number) - (userB[key] as number));
        if (diff <= 200) matchedWeight += weight; // e.g., within $200 is a match
      } else if (userA[key] === userB[key]) {
        matchedWeight += weight;
      }
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round((matchedWeight / totalWeight) * 100);
}

// Example profiles for testing
const alice = {
  clean: 'excellent',
  budget: 1000,
  social: 'Introvert',
  study: 'Regular',
  sleep: 'Early_Bird',
  housingPreference: 'Apartment',
  locationPreference: 'Near Campus',
};

const bob = {
  clean: 'good',
  budget: 950,
  social: 'Introvert',
  study: 'Regular',
  sleep: 'Early_Bird',
  housingPreference: 'Apartment',
  locationPreference: 'Near Campus',
};

const charlie = {
  clean: 'excellent',
  budget: 1200,
  social: 'Extrovert',
  study: 'Cramming',
  sleep: 'Night_Owl',
  housingPreference: 'House',
  locationPreference: 'Far',
};

// Example: compare alice to others and sort by compatibility
export function testCompatibility() {
  const others = [
    { name: 'Bob', profile: bob },
    { name: 'Charlie', profile: charlie },
  ];
  const results = others.map((other) => ({
    name: other.name,
    score: calculateCompatibility(alice, other.profile),
  }));
  results.sort((a, b) => b.score - a.score);
  return results;
}

// Uncomment to test in Node.js
// console.log(testCompatibility());