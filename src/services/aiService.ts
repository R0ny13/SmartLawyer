/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ContractRecord } from "../types";

// Initialize the API with the platform-injected key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    overallStatus: { 
      type: Type.STRING,
      enum: ['safe', 'caution', 'risky']
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          originalText: { type: Type.STRING },
          simplifiedText: { type: Type.STRING },
          riskLevel: { 
            type: Type.STRING,
            enum: ['safe', 'caution', 'risky']
          },
          riskExplanation: { type: Type.STRING }
        },
        required: ['id', 'title', 'originalText', 'simplifiedText', 'riskLevel']
      }
    },
    suggestedQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ['name', 'overallScore', 'overallStatus', 'sections', 'suggestedQuestions']
};

export async function analyzeContract(fileData: string, mimeType: string, fileName: string): Promise<ContractRecord> {
  const prompt = `
    You are an expert legal assistant. Analyze the provided contract document.
    1. Break it down into key sections (Liability, Termination, Payment, etc.).
    2. For each section, provide the original legalese and a simplified "SmartLawyer" translation for a non-lawyer.
    3. Evaluate the risk level (safe, caution, risky) and explain WHY.
    4. Provide an overall compliance score (0-100) where 100 is extremely fair and standard.
    5. Suggest 3 follow-up questions for the user to ask about this specific contract.
    
    Return the analysis strictly in the requested JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            { 
              inlineData: {
                data: fileData.split(',')[1] || fileData, 
                mimeType: mimeType 
              } 
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    const result = JSON.parse(response.text);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName,
      uploadDate: new Date().toLocaleDateString(),
      fileSize: "Processed",
      ...result
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw error;
  }
}

export async function askQuestion(contractContext: any, question: string): Promise<string> {
  const prompt = `
    You are an AI legal assistant specializing in contract interpretation. 
    The user has a question about their contract: "${question}"
    
    Here is the context of the analyzed contract:
    ${JSON.stringify(contractContext)}

    Please provide a concise, professional answer in plain English. 
    Focus on practical implications and risks related to their specific question.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    return response.text || "I'm sorry, I couldn't generate an answer for that.";
  } catch (error) {
    console.error("AI Q&A failed:", error);
    return "Error: Unable to connect to Legal AI. Please try again.";
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text || targetLanguage.toLowerCase() === 'english') return text;

  const prompt = `
    Translate the following legal text accurately into ${targetLanguage}. 
    Maintain the legal meaning and tone. 
    Only return the translated text, nothing else.
    
    Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
}

export async function translateContractSections(sections: any[], targetLanguage: string): Promise<Record<string, { original: string, simplified: string }>> {
  if (targetLanguage.toLowerCase() === 'english') return {};

  const payload = sections.map(s => ({
    id: s.id,
    original: s.originalText,
    simplified: s.simplifiedText
  }));

  const prompt = `
    Translate the following legal sections into ${targetLanguage}.
    Maintain legal accuracy and the distinct tone between the original legalese and the simplified insight.
    Return a JSON object where keys are the section IDs and values are objects with "original" and "simplified" translated strings.
    
    Sections: ${JSON.stringify(payload)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Bulk translation failed:", error);
    return {};
  }
}
