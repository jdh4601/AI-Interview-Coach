import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies } from '../data/companies';
import { useSessionStore } from '../stores/useSessionStore';
import type { Job } from '../types/company';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageContainer } from '../components/layout/PageContainer';
import { StepIndicator } from '../components/layout/StepIndicator';

export default function CompanySelectPage() {
  const navigate = useNavigate();
  const { companyId, jobId, setCompany } = useSessionStore();
  const [selectedCompany, setSelectedCompany] = useState(companyId || '');
  const [selectedJob, setSelectedJob] = useState(jobId || '');

  const company = companies.find((c) => c.company_id === selectedCompany);

  function handleCompanySelect(id: string) {
    setSelectedCompany(id);
    setSelectedJob('');
  }

  function handleJobSelect(job: Job) {
    if (!job.active) return;
    setSelectedJob(job.job_id);
  }

  function handleNext() {
    if (!selectedCompany || !selectedJob) return;
    setCompany(selectedCompany, selectedJob);
    navigate('/setup/resume');
  }

  return (
    <PageContainer>
      <StepIndicator currentStep={1} />

      <h1 className="mb-8 text-2xl font-bold">기업 / 직무 선택</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-300">기업 선택</h2>
        <div className="grid gap-4">
          {companies.map((c) => (
            <Card
              key={c.company_id}
              selected={selectedCompany === c.company_id}
              onClick={() => handleCompanySelect(c.company_id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/toss-logo.png"
                  alt={`${c.name} logo`}
                  className="h-12 w-12 rounded-lg object-contain"
                />
                <div>
                  <h3 className="font-semibold text-slate-100">{c.name}</h3>
                  <p className="text-sm text-slate-400">{c.company_summary}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {company && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-300">직무 선택</h2>
          <div className="grid grid-cols-3 gap-3">
            {company.jobs.map((job) => (
              <Card
                key={job.job_id}
                selected={selectedJob === job.job_id}
                disabled={!job.active}
                onClick={() => handleJobSelect(job)}
                className="text-center"
              >
                <p className={`text-sm font-medium ${job.active ? 'text-slate-100' : 'text-slate-500'}`}>
                  {job.title}
                </p>
                {!job.active && (
                  <p className="mt-1 text-xs text-slate-600">준비 중</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedCompany || !selectedJob}
        >
          다음
        </Button>
      </div>
    </PageContainer>
  );
}
