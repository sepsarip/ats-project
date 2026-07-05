export const APPLICATION_STATUSES = [
  {
    value: 'applied',
    label: 'Applied',
    description: 'The candidate has applied for the job but has not yen been processed further.',
  },
  {
    value: 'interview',
    label: 'Interview',
    description: 'The candidate has entered the interview stage.',
  },
  {
    value: 'offered',
    label: 'Offered',
    description: 'The candidate has been offered the job.',
  },
  {
    value: 'hired',
    label: 'Hired',
    description: 'The candidate has been officially hired.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'The candidate has been rejected and will not be processed further.',
  },
];

export const APPLICATION_STATUS_VALUES = APPLICATION_STATUSES.map(
  (s) => s.value,
);

export default APPLICATION_STATUSES;
