export const APPLICATION_STATUSES = [
  {
    value: 'applied',
    label: 'Applied',
    description: 'Kandidat melamar pekerjaan dan belum diproses lebih lanjut.',
  },
  {
    value: 'interview',
    label: 'Interview',
    description: 'Kandidat masuk tahap wawancara.',
  },
  {
    value: 'offered',
    label: 'Offered',
    description: 'Kandidat telah diberikan penawaran pekerjaan.',
  },
  {
    value: 'hired',
    label: 'Hired',
    description: 'Kandidat telah resmi dipekerjakan.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Kandidat telah ditolak dan tidak akan diproses lebih lanjut.',
  },
];

export const APPLICATION_STATUS_VALUES = APPLICATION_STATUSES.map(
  (s) => s.value,
);

export default APPLICATION_STATUSES;
