/**
 * Grading Calculations for Frontend Preview
 */

export function calculateGrade(score) {
  const numericScore = parseFloat(score);
  if (isNaN(numericScore)) return 'F9';

  if (numericScore >= 75) return 'A1';
  if (numericScore >= 70) return 'B2';
  if (numericScore >= 65) return 'B3';
  if (numericScore >= 60) return 'C4';
  if (numericScore >= 55) return 'C5';
  if (numericScore >= 50) return 'C6';
  if (numericScore >= 45) return 'D7';
  if (numericScore >= 40) return 'E8';
  return 'F9';
}

export function calculateRemark(grade) {
  switch (grade) {
    case 'A1': return 'Excellent';
    case 'B2': return 'Very Good';
    case 'B3': return 'Good';
    case 'C4':
    case 'C5':
    case 'C6': return 'Credit';
    case 'D7':
    case 'E8': return 'Pass';
    case 'F9': return 'Fail';
    default: return 'No Grade';
  }
}
