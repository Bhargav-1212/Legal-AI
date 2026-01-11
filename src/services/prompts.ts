export const GLOBAL_SAFETY_FOOTER = `
\n────────────────────────────────────────
**DISCLAIMER**: I am an AI assistant, not a lawyer. This analysis is for educational purposes only and does not constitute legal advice. 
Indian laws are subject to amendment and judicial interpretation. Always consult a qualified Advocate for official legal counsel.
────────────────────────────────────────
`;

export const DOCUMENT_ANALYSIS_PROMPT = (documentText: string) => `
Analyze the following legal document under INDIAN law.

REFERENCE FRAMEWORK:
- Constitution of India
- Indian Penal Code (IPC)
- Code of Criminal Procedure (CrPC)
- Indian Contract Act
- Evidence Act
- Consumer Protection Act
- General Supreme Court principles

DOCUMENT TEXT:
${documentText}

TASKS:
1. Executive Summary (3-4 sentences)
2. Nature of Document (Contract, Notice, etc.)
3. Parties & Roles
4. Key Legal Issues (No invented sections)
5. Risk Assessment (Low/Medium/High)
6. Important Dates & Obligations
7. General Legal Observations (No advice)

RULES:
- Do NOT hallucinate IPC/CrPC section numbers.
- Do NOT invent case names.
- If information is missing, say "Not found in document".
- Keep output concise, structured, and neutral.

EXPECTED RESPONSE FORMAT (STRICT JSON):
{
  "summary": "string",
  "document_type": "string",
  "parties": [
    { "name": "string", "role": "string" }
  ],
  "legal_issues": ["string"],
  "risk_level": "Low | Medium | High",
  "important_points": ["string"],
  "observations": ["string"],
  "confidence_score": number
}
`;

export const LEGAL_RESEARCH_PROMPT = (question: string) => `
Answer the following question under INDIAN law.

LEGAL REFERENCES:
- Constitution of India
- IPC, CrPC, CPC
- Indian Contract Act
- Consumer Protection Act
- General principles from Supreme Court

QUESTION:
${question}

TASKS:
1. Explain the legal concept in simple language.
2. Mention relevant Indian laws or legal principles (no fake citations).
3. Explain how it is generally applied in real life.
4. Clearly state limitations or uncertainty.
5. Mention when professional legal advice is recommended.

RULES:
- Do NOT guarantee correctness.
- Do NOT invent judgments or sections.
- Prefer clarity over legal jargon.

EXPECTED RESPONSE FORMAT (STRICT JSON):
{
  "answer": "string",
  "relevant_laws": ["string"],
  "practical_explanation": ["string"],
  "when_to_consult_lawyer": "string",
  "confidence_score": number
}
`;
