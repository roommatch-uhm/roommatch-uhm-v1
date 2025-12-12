'use client';

import { Form } from 'react-bootstrap';

export type DealbreakerOption = {
  value: string;
  label: string;
  description?: string;
};

// Define all possible dealbreaker options based on profile attributes
export const DEALBREAKER_OPTIONS: DealbreakerOption[] = [
  // Cleanliness levels (only poor and fair - it makes sense to exclude messy people)
  { value: 'clean:poor', label: 'Poor Cleanliness', description: 'Exclude messy roommates' },
  { value: 'clean:fair', label: 'Fair Cleanliness', description: 'Exclude somewhat messy roommates' },

  // Social types (exclude Unsure - doesn't make sense)
  { value: 'social:Introvert', label: 'Introverts', description: 'Exclude introverted roommates' },
  { value: 'social:Ambivert', label: 'Ambiverts', description: 'Exclude ambiverted roommates' },
  { value: 'social:Extrovert', label: 'Extroverts', description: 'Exclude extroverted roommates' },

  // Study habits
  { value: 'study:Cramming', label: 'Cramming Study Style', description: 'Exclude those who cram for exams' },
  { value: 'study:Regular', label: 'Regular Study Style', description: 'Exclude those who study regularly' },
  { value: 'study:None', label: 'No Study Habits', description: 'Exclude those who don\'t study' },

  // Sleep schedules
  { value: 'sleep:Early_Bird', label: 'Early Birds', description: 'Exclude early sleepers' },
  { value: 'sleep:Night_Owl', label: 'Night Owls', description: 'Exclude late sleepers' },
];

type DealBreakersProps = {
  selectedDealbreakers: string[];
  onChange: (dealbreakers: string[]) => void;
  error?: string;
};

const DealBreakers = ({ selectedDealbreakers, onChange, error }: DealBreakersProps) => {
  const handleCheckboxChange = (value: string) => {
    if (selectedDealbreakers.includes(value)) {
      onChange(selectedDealbreakers.filter((db) => db !== value));
    } else {
      onChange([...selectedDealbreakers, value]);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <strong>Dealbreakers</strong>
        <small className="text-muted d-block">
          Select attributes that would prevent you from matching with someone
        </small>
      </Form.Label>

      <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* Cleanliness Section */}
        <div className="mb-3">
          <h6 className="text-dark">Cleanliness</h6>
          {DEALBREAKER_OPTIONS.filter((opt) => opt.value.startsWith('clean:')).map((option) => (
            <Form.Check
              key={option.value}
              type="checkbox"
              id={`dealbreaker-${option.value}`}
              label={
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <small className="text-muted">{option.description}</small>
                  )}
                </div>
              }
              checked={selectedDealbreakers.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="mb-2"
            />
          ))}
        </div>

        {/* Social Type Section */}
        <div className="mb-3">
          <h6 className="text-dark">Social Type</h6>
          {DEALBREAKER_OPTIONS.filter((opt) => opt.value.startsWith('social:')).map((option) => (
            <Form.Check
              key={option.value}
              type="checkbox"
              id={`dealbreaker-${option.value}`}
              label={
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <small className="text-muted">{option.description}</small>
                  )}
                </div>
              }
              checked={selectedDealbreakers.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="mb-2"
            />
          ))}
        </div>

        {/* Study Habits Section */}
        <div className="mb-3">
          <h6 className="text-dark">Study Habits</h6>
          {DEALBREAKER_OPTIONS.filter((opt) => opt.value.startsWith('study:')).map((option) => (
            <Form.Check
              key={option.value}
              type="checkbox"
              id={`dealbreaker-${option.value}`}
              label={
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <small className="text-muted">{option.description}</small>
                  )}
                </div>
              }
              checked={selectedDealbreakers.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="mb-2"
            />
          ))}
        </div>

        {/* Sleep Schedule Section */}
        <div className="mb-3">
          <h6 className="text-dark">Sleep Schedule</h6>
          {DEALBREAKER_OPTIONS.filter((opt) => opt.value.startsWith('sleep:')).map((option) => (
            <Form.Check
              key={option.value}
              type="checkbox"
              id={`dealbreaker-${option.value}`}
              label={
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <small className="text-muted">{option.description}</small>
                  )}
                </div>
              }
              checked={selectedDealbreakers.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="mb-2"
            />
          ))}
        </div>
      </div>

      {error && <div className="text-danger mt-2">{error}</div>}

      {selectedDealbreakers.length > 0 && (
        <small className="text-muted d-block mt-2">
          {selectedDealbreakers.length} dealbreaker{selectedDealbreakers.length !== 1 ? 's' : ''} selected
        </small>
      )}
    </Form.Group>
  );
};

export default DealBreakers;
