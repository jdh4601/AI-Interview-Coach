import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies } from '../data/companies';
import { useSessionStore } from '../stores/useSessionStore';
import type { Job } from '../types/company';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Card } from '../components/ui/Card';

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
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col relative z-10">
      
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
          <span className="text-xs font-data tracking-wider text-ghost/70">STEP 01 / 03</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
          기업 및 직무 선택
        </h1>
        <p className="mt-4 text-lg text-ghost/60 font-drama italic">
          "타겟 기업과 직무의 맥락을 분석하여 정교한 면접 질문을 생성합니다."
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-ghost tracking-wide">Target Company</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {companies.map((c) => (
            <Card
              key={c.company_id}
              selected={selectedCompany === c.company_id}
              onClick={() => handleCompanySelect(c.company_id)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${selectedCompany === c.company_id ? 'bg-electric-blue text-white' : 'bg-white/10 text-ghost'}`}>
                  {c.name.substring(0, 1)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{c.name}</h3>
                  <p className="text-sm text-ghost/60 mt-1 leading-relaxed">{c.company_summary}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {company && (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="mb-6 text-xl font-semibold text-ghost tracking-wide">Target Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {company.jobs.map((job) => (
              <Card
                key={job.job_id}
                selected={selectedJob === job.job_id}
                disabled={!job.active}
                onClick={() => handleJobSelect(job)}
                className="text-center py-8"
              >
                <p className={`text-base font-semibold tracking-wide ${job.active ? 'text-white' : 'text-ghost/40'}`}>
                  {job.title}
                </p>
                {!job.active && (
                  <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-ghost/50 font-data">
                    COMING SOON
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mt-auto flex justify-end pt-8 border-t border-white/10">
        <MagneticButton
          onClick={handleNext}
          disabled={!selectedCompany || !selectedJob}
          className={`${(!selectedCompany || !selectedJob) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          다음 단계로
        </MagneticButton>
      </div>
    </div>
  );
}
