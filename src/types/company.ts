export interface Job {
  readonly job_id: string;
  readonly title: string;
  readonly active: boolean;
  readonly focus_points: readonly string[];
}

export interface Company {
  readonly company_id: string;
  readonly name: string;
  readonly company_summary: string;
  readonly talent_profile: readonly string[];
  readonly culture_fit: readonly string[];
  readonly jobs: readonly Job[];
}
