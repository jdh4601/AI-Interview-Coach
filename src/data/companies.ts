import type { Company } from '../types/company';

export const companies: readonly Company[] = [
  {
    company_id: 'toss',
    name: 'TOSS',
    company_summary: '금융 플랫폼 기반의 핀테크 서비스 기업',
    talent_profile: [
      '송금·결제·투자·보험 등 파편화된 금융 서비스를 하나로 통합한 혁신 플랫폼',
      '어렵고 복잡한 금융의 표준을 깨고, 누구나 쉽고 간편하게 누리는 접근성 제공',
      '엄격한 금융 보안/규제를 준수하면서도 기술적 유연함을 잃지 않는 핀테크 리더',
      '직관이나 관습이 아닌 실질적인 사용자 데이터와 지표를 기반으로 성장하는 조직',
      '정보 비대칭을 해소하여 사용자에게 더 유리한 선택권과 금융 주권 부여',
    ],
    culture_fit: [
      '자율적인 환경에서 최고의 성과를 내기 위해 스스로를 강하게 동기부여하는 태도',
      '모든 정보를 사내에 공개하고, 논리와 근거를 바탕으로 거침없이 피드백을 주고받는 문화',
      '마이크로 매니징 없이 스스로 목표를 설정하되, 결과에 대해서는 끝까지 책임지는 DRI',
      '완벽함보다 속도를 중시하며, 가설 수립과 실험을 통해 서비스를 끊임없이 개선하는 방식',
      '동료를 최고의 인재로 믿고, 개인의 성장이 팀의 성장으로 이어지는 이타적인 마인드셋',
    ],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: [
          '데스크톱 기반 업무 도구의 복잡도 해소 및 유려한 UX 구현',
          '초고속 빌드·배포 환경 구축 및 개발 도구 자동화/최적화',
          '까다로운 요구사항을 단순화하여 재사용 가능한 코드로 설계',
          '스스로 문제를 정의하고 솔루션을 제안하는 직접 의사결정',
          '코드 리뷰, 테크 톡, 오픈소스 기여를 통한 동반 성장 추구',
        ],
      },
      {
        job_id: 'po',
        title: 'Product Owner',
        active: false,
        focus_points: [],
      },
      {
        job_id: 'server',
        title: 'Server Developer',
        active: false,
        focus_points: [],
      },
    ],
  },
];
