export const TOPICS = {
  'ai-governance': {
    label: 'AI Governance',
    description:
      'Regulatory frameworks, compliance obligations, and governance practices for AI systems — including the EU AI Act, NIST AI RMF, and emerging AI liability regimes.',
  },
  'privacy-law': {
    label: 'Privacy & Data Protection',
    description:
      'Global privacy regulations, data subject rights, cross-border transfer mechanisms, and compliance strategy — including GDPR, CCPA, and emerging national privacy laws.',
  },
  'cybersecurity-compliance': {
    label: 'Cybersecurity Compliance',
    description:
      'Regulatory obligations, incident reporting requirements, and security frameworks — including NIS2, DORA, NIST CSF, and sector-specific cybersecurity mandates.',
  },
  'enterprise-risk': {
    label: 'Enterprise Risk',
    description:
      'Risk governance, third-party and vendor risk management, operational resilience, and board-level risk intelligence.',
  },
} as const;

export type TopicSlug = keyof typeof TOPICS;
export const TOPIC_SLUGS = Object.keys(TOPICS) as TopicSlug[];
