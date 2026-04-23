/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'safe' | 'caution' | 'risky';

export interface ContractSection {
  id: string;
  title: string;
  originalText: string;
  simplifiedText: string;
  riskLevel: RiskLevel;
  riskExplanation?: string;
}

export interface ContractRecord {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  overallScore: number; // 0-100
  overallStatus: RiskLevel;
  sections: ContractSection[];
  suggestedQuestions: string[];
}

export interface ComparisonResult {
  title: string;
  contract1Value: string;
  contract2Value: string;
  difference: string;
  riskImpact: 'neutral' | 'improved' | 'declined';
}
