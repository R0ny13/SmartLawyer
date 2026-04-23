/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContractRecord } from './types';

export const MOCK_CONTRACTS: ContractRecord[] = [
  {
    id: '1',
    name: 'Employment_Agreement_John_Doe.pdf',
    uploadDate: '2024-03-20',
    fileSize: '1.2 MB',
    overallScore: 85,
    overallStatus: 'safe',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        originalText: 'This Employment Agreement (the "Agreement") is entered into as of March 20, 2024, by and between TechFlow Solutions Inc. (the "Employer") and John Doe (the "Employee").',
        simplifiedText: 'This is a standard contract between you and TechFlow Solutions starting March 20, 2024.',
        riskLevel: 'safe',
      },
      {
        id: 'termination',
        title: 'Termination Clause',
        originalText: 'Employer may terminate Employee\'s employment at any time for "Cause" (as defined herein) upon written notice. Employee may terminate their employment upon thirty (30) days\' prior written notice.',
        simplifiedText: 'The company can fire you immediately if you break serious rules. You can quit if you give them 30 days notice.',
        riskLevel: 'caution',
        riskExplanation: '30 days notice is standard, but the definition of "Cause" should be reviewed for clarity.',
      },
      {
        id: 'liability',
        title: 'Limitation of Liability',
        originalText: 'Employee shall indemnify and hold Employer harmless from any and all claims, damages, or liabilities arising out of Employee\'s gross negligence or willful misconduct.',
        simplifiedText: 'If you do something very careless or intentionally wrong on purpose, you might have to pay for the damages yourself.',
        riskLevel: 'risky',
        riskExplanation: 'This clause places significant financial burden on you for "gross negligence", which can be broadly interpreted.',
      }
    ],
    suggestedQuestions: [
      'What exactly counts as "Cause" for immediate firing?',
      'Is there professional liability insurance provided by the company?',
      'Can the 30-day notice period be waived by mutual agreement?'
    ]
  },
  {
    id: '2',
    name: 'Freelance_Service_OTA.pdf',
    uploadDate: '2024-03-15',
    fileSize: '0.8 MB',
    overallScore: 45,
    overallStatus: 'risky',
    sections: [
      {
        id: 'payment',
        title: 'Payment Terms',
        originalText: 'Payments shall be disbursed within 90 days of invoice approval. Late fees are strictly prohibited.',
        simplifiedText: 'You won\'t get paid for 3 months after they approve your work, and you can\'t charge them extra if they pay even later.',
        riskLevel: 'risky',
        riskExplanation: 'Standard industry payment time is 30 days. 90 days is very slow and the "no late fees" rule leaves you with no leverage.',
      }
    ],
    suggestedQuestions: [
      'Can we reduce the payment term to 30 or 45 days?',
      'Is there a deposit required before work starts?'
    ]
  }
];
