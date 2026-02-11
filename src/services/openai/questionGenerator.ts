import type { Question, QuestionType } from '../../types/question';
import { openai } from './client';

interface GenerateQuestionsParams {
  readonly companyName: string;
  readonly companySummary: string;
  readonly talentProfile: readonly string[];
  readonly cultureFit: readonly string[];
  readonly jobTitle: string;
  readonly focusPoints: readonly string[];
  readonly resumeText: string;
  readonly questionCount: number;
  readonly interviewStyle: 'friendly' | 'pressure';
}

interface RawQuestion {
  readonly order: number;
  readonly questionText: string;
  readonly questionType: QuestionType;
  readonly context: string;
}

function buildSystemPrompt(params: GenerateQuestionsParams): string {
  const styleGuide =
    params.interviewStyle === 'pressure'
      ? '당신은 날카롭고 도전적인 면접관입니다. 지원자의 답변을 깊이 파고들고, 구체적인 근거를 요구하며, 압박 질문을 통해 진정한 역량을 검증합니다.'
      : '당신은 따뜻하고 격려적인 면접관입니다. 지원자가 편안하게 자신의 경험을 이야기할 수 있도록 유도하며, 긍정적인 분위기에서 역량을 파악합니다.';

  return `당신은 ${params.companyName}의 경험 많은 한국어 면접관입니다.
${styleGuide}

[회사 정보]
- 회사명: ${params.companyName}
- 회사 요약: ${params.companySummary}
- 인재상: ${params.talentProfile.join(', ')}
- 조직문화 핵심가치: ${params.cultureFit.join(', ')}

[채용 포지션]
- 직무: ${params.jobTitle}
- 핵심 평가 포인트: ${params.focusPoints.join(', ')}

아래 규칙을 반드시 따르세요:
1. 총 ${params.questionCount}개의 면접 질문을 생성하세요.
2. 첫 번째 질문(order: 1)은 반드시 자기소개 질문이어야 합니다 (questionType: "intro").
3. 나머지 질문은 resume(이력서 기반), competency(역량), situational(상황) 유형을 적절히 섞어주세요.
4. 각 질문에는 왜 이 질문을 하는지 context를 포함하세요.
5. 모든 질문과 context는 한국어로 작성하세요.

응답은 반드시 아래 JSON 형식으로 반환하세요:
{
  "questions": [
    {
      "order": 1,
      "questionText": "질문 내용",
      "questionType": "intro" | "resume" | "competency" | "situational",
      "context": "이 질문을 하는 이유"
    }
  ]
}`;
}

function buildUserPrompt(resumeText: string): string {
  return `[지원자 이력서]
${resumeText}

위 이력서를 참고하여 면접 질문을 생성해주세요.`;
}

export async function generateQuestions(
  params: GenerateQuestionsParams,
): Promise<Question[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt(params) },
      { role: 'user', content: buildUserPrompt(params.resumeText) },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty response for question generation');
  }

  const parsed: { questions: readonly RawQuestion[] } = JSON.parse(content);

  return parsed.questions.map((q) => ({
    order: q.order,
    questionText: q.questionText,
    questionType: q.questionType,
    context: q.context,
  }));
}
