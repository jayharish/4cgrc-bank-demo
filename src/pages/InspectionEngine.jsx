import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Play, CheckCircle2, XCircle, MinusCircle, ChevronRight,
  ChevronDown, Building2, AlertTriangle, Award, Clock, FileText, X,
  RefreshCw, Loader2, Send, Eye, Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const WEIGHT_META = {
  W5: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', score: 5 },
  W4: { label: 'High', color: '#F97316', bg: 'rgba(249,115,22,0.12)', score: 4 },
  W3: { label: 'Medium', color: '#EAB308', bg: 'rgba(234,179,8,0.12)', score: 3 },
  W2: { label: 'Low', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', score: 2 },
  W1: { label: 'Minor', color: '#64748B', bg: 'rgba(100,116,139,0.12)', score: 1 },
};

const SLA_HOURS = { W5: 4, W4: 24, W3: 72, W2: 168, W1: 336 };

function calculateScore(template, responses) {
  if (!template?.items) return { score: 0, total: 0, passed: 0, failed: 0, na: 0 };
  let totalWeight = 0, passedWeight = 0, failed = 0, passed = 0, na = 0;
  let hasOpenW5 = false, hasOpenW4 = false;

  template.items.forEach(section => {
    section.items.forEach(item => {
      const w = WEIGHT_META[item.weight]?.score || 1;
      const r = responses[item.id];
      if (r === 'na') { na++; return; }
      totalWeight += w;
      if (r === 'pass') { passedWeight += w; passed++; }
      else if (r === 'fail') {
        failed++;
        if (item.weight === 'W5') hasOpenW5 = true;
        if (item.weight === 'W4') hasOpenW4 = true;
      }
    });
  });

  let score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;
  if (hasOpenW5 && score > 70) score = 70;
  else if (hasOpenW4 && score > 82) score = 82;

  return { score, total: passed + failed, passed, failed, na };
}

function WeightBadge({ weight }) {
  const meta = WEIGHT_META[weight] || WEIGHT_META.W3;
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: meta.bg, color: meta.color }}>
      {weight} · {meta.label}
    </span>
  );
}

function ScoreRing({ score, size = 80 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <span className="absolute text-lg font-black" style={{ color }}>{score}%</span>
    </div>
  );
}

function TemplateCard({ template, onStart, submissionCount }) {
  const allItems = template.items?.flatMap(s => s.items) || [];
  const w5count = allItems.filter(i => i.weight === 'W5').length;
  const w4count = allItems.filter(i => i.weight === 'W4').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: template.category === 'ATM' ? 'rgba(139,92,246,0.15)' : 'rgba(37,99,235,0.12)', color: template.category === 'ATM' ? '#7C3AED' : '#2563EB' }}>
                {template.category}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-4)' }}>v{template.version || '1.0'}</span>
            </div>
            <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text-1)' }}>{template.name}</h3>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-4)' }}>{template.description}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 flex items-center gap-4 flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
          <ClipboardList size={12} />
          <span>{template.items?.length || 0} sections · {allItems.length} items</span>
        </div>
        {w5count > 0 && <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: WEIGHT_META.W5.bg, color: WEIGHT_META.W5.color }}>{w5count}×W5</span>}
        {w4count > 0 && <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: WEIGHT_META.W4.bg, color: WEIGHT_META.W4.color }}>{w4count}×W4</span>}
        <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: 'var(--text-4)' }}>
          <FileText size={11} />
          <span>{submissionCount || 0} submissions</span>
        </div>
      </div>

      <div className="px-5 py-3">
        <button
          onClick={() => onStart(template)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          <Play size={14} />
          Start Inspection
        </button>
      </div>
    </motion.div>
  );
}

function BranchPicker({ branches, atms, category, value, onChange }) {
  const options = category === 'ATM' ? atms : branches;
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-3)' }}>
        Select {category === 'ATM' ? 'ATM' : 'Branch'}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium border"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
      >
        <option value="">— Select {category === 'ATM' ? 'ATM' : 'Branch'} —</option>
        {options.map(item => (
          <option key={item.id} value={item.id}>{item.id} · {item.name}</option>
        ))}
      </select>
    </div>
  );
}

function StartModal({ template, branches, atms, onClose, onStart }) {
  const [selected, setSelected] = useState('');
  const [inspectorNote, setInspectorNote] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="px-6 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--text-1)' }}>Start Inspection</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{template.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--text-4)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <BranchPicker branches={branches} atms={atms} category={template.category} value={selected} onChange={setSelected} />
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-3)' }}>Inspector Notes (optional)</label>
            <textarea
              rows={2}
              value={inspectorNote}
              onChange={e => setInspectorNote(e.target.value)}
              placeholder="Any pre-inspection observations..."
              className="w-full px-3 py-2 rounded-xl text-sm border resize-none"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => onStart(selected, inspectorNote)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: selected ? 'var(--accent)' : 'var(--surface-3)' }}
            >
              <Play size={13} />
              Begin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InspectionForm({ template, targetId, targetName, inspectorNote, profile, branches, atms, onDone }) {
  const [responses, setResponses] = useState({});
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const sections = template.items || [];
  const currentSection = sections[currentSectionIdx];
  const stats = useMemo(() => calculateScore(template, responses), [template, responses]);

  const sectionProgress = (section) => {
    const ids = section.items.map(i => i.id);
    const answered = ids.filter(id => responses[id]).length;
    return { answered, total: ids.length };
  };

  const setResponse = (itemId, value) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const allAnswered = useMemo(() => {
    const allIds = sections.flatMap(s => s.items.map(i => i.id));
    return allIds.every(id => responses[id]);
  }, [sections, responses]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { score, failed } = calculateScore(template, responses);
      const scoreBreakdown = {};
      sections.forEach(s => {
        s.items.forEach(item => {
          scoreBreakdown[item.id] = {
            result: responses[item.id] || 'na',
            weight: item.weight,
            text: item.text,
          };
        });
      });

      // Find the actual branch/ATM object
      const isAtm = template.category === 'ATM';
      const targets = isAtm ? atms : branches;
      const target = targets.find(t => t.id === targetId);

      const { data: submission } = await supabase.from('checklist_submissions').insert({
        template_id: template.id,
        branch_id: isAtm ? null : targetId,
        atm_id: isAtm ? targetId : null,
        submitted_by: profile?.id,
        score,
        status: 'Completed',
        responses: scoreBreakdown,
        notes: inspectorNote || null,
        inspector_name: profile?.full_name || profile?.email,
        branch_name: target?.name || targetId,
        tickets_created: 0,
      }).select().single();

      // Auto-create incidents for failed W3–W5 items
      const failedItems = sections.flatMap(s =>
        s.items.filter(item =>
          responses[item.id] === 'fail' && ['W5', 'W4', 'W3'].includes(item.weight)
        ).map(item => ({ ...item, sectionTitle: s.title }))
      );

      let ticketCount = 0;
      for (const item of failedItems) {
        const priority = { W5: 'Critical', W4: 'High', W3: 'Medium' }[item.weight];
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + SLA_HOURS[item.weight]);
        const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

        await supabase.from('incidents').insert({
          ticket_id: ticketId,
          title: `[Inspection Finding] ${item.text}`,
          description: `Auto-generated from inspection of ${target?.name || targetId}. Section: ${item.sectionTitle}. Regulatory ref: ${item.ref || 'N/A'}`,
          location: target?.name || targetId,
          emirate: target?.emirate || 'UAE',
          branch_id: isAtm ? null : targetId,
          atm_id: isAtm ? targetId : null,
          type: isAtm ? 'atm' : 'branch',
          category: item.sectionTitle,
          department: 'Compliance',
          priority,
          status: 'Pending',
          reported_by: profile?.full_name || profile?.email,
          reported_date: new Date().toISOString().split('T')[0],
          due_date: dueDate.toISOString().split('T')[0],
        });
        ticketCount++;
      }

      if (submission) {
        await supabase.from('checklist_submissions').update({ tickets_created: ticketCount }).eq('id', submission.id);
        await supabase.from('checklist_templates').update({
          last_used: new Date().toISOString().split('T')[0],
          use_count: (template.use_count || 0) + 1,
        }).eq('id', template.id);
      }

      setSubmitted({ score, failed, ticketCount, targetName: target?.name || targetId });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const color = submitted.score >= 85 ? '#10B981' : submitted.score >= 70 ? '#F59E0B' : '#EF4444';
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-8 text-center max-w-md mx-auto">
        <ScoreRing score={submitted.score} size={120} />
        <h2 className="text-2xl font-black mt-6" style={{ color: 'var(--text-1)' }}>Inspection Complete</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-3)' }}>{submitted.targetName}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-4)' }}>Compliance Score</p>
            <p className="text-2xl font-black mt-1" style={{ color }}>{submitted.score}%</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-4)' }}>Tickets Created</p>
            <p className="text-2xl font-black mt-1" style={{ color: submitted.ticketCount > 0 ? '#EF4444' : '#10B981' }}>
              {submitted.ticketCount}
            </p>
          </div>
        </div>
        {submitted.ticketCount > 0 && (
          <div className="mt-4 w-full rounded-xl px-4 py-3 flex items-start gap-2.5 text-left"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>
              {submitted.ticketCount} compliance ticket{submitted.ticketCount > 1 ? 's' : ''} auto-created for failed W3–W5 items. View them in Incidents.
            </p>
          </div>
        )}
        <button onClick={onDone}
          className="mt-8 w-full py-3 rounded-2xl font-semibold text-white"
          style={{ background: 'var(--accent)' }}>
          Done — Back to Templates
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full" style={{ minHeight: '600px' }}>
      {/* Section sidebar */}
      <div className="w-56 shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-4)' }}>Sections</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface-3)' }}>
              <div className="h-1.5 rounded-full bg-blue-500 transition-all"
                style={{ width: `${(stats.passed + stats.failed + stats.na) / Math.max(sections.flatMap(s => s.items).length, 1) * 100}%` }} />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--text-3)' }}>
              {stats.passed + stats.failed + stats.na}/{sections.flatMap(s => s.items).length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {sections.map((section, idx) => {
            const sp = sectionProgress(section);
            const isActive = idx === currentSectionIdx;
            const done = sp.answered === sp.total;
            return (
              <button key={section.id} onClick={() => setCurrentSectionIdx(idx)}
                className="w-full text-left px-4 py-3 flex items-start gap-2.5 transition-all"
                style={{ background: isActive ? 'rgba(37,99,235,0.12)' : 'transparent', borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent' }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${done ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-500 text-white' : ''}`}
                  style={!done && !isActive ? { background: 'var(--surface-3)', color: 'var(--text-4)' } : {}}>
                  {done ? '✓' : idx + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold leading-snug" style={{ color: isActive ? '#2563EB' : 'var(--text-2)' }}>{section.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{sp.answered}/{sp.total} done</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-center mb-3">
            <p className="text-xs" style={{ color: 'var(--text-4)' }}>Live Score</p>
            <p className="text-2xl font-black" style={{ color: stats.score >= 85 ? '#10B981' : stats.score >= 70 ? '#F59E0B' : '#EF4444' }}>
              {stats.score}%
            </p>
          </div>
          <button
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: allAnswered ? 'var(--accent)' : 'var(--surface-3)' }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {!allAnswered && (
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-4)' }}>Answer all items to submit</p>
          )}
        </div>
      </div>

      {/* Items panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentSection && (
          <motion.div key={currentSection.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{currentSection.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{currentSection.items.length} inspection items</p>
              </div>
              <div className="flex gap-2">
                {currentSectionIdx > 0 && (
                  <button onClick={() => setCurrentSectionIdx(i => i - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
                    ← Prev
                  </button>
                )}
                {currentSectionIdx < sections.length - 1 && (
                  <button onClick={() => setCurrentSectionIdx(i => i + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--accent)', color: '#fff' }}>
                    Next →
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {currentSection.items.map((item, idx) => {
                const r = responses[item.id];
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl p-4"
                    style={{
                      background: r === 'pass' ? 'rgba(16,185,129,0.06)' : r === 'fail' ? 'rgba(239,68,68,0.06)' : 'var(--surface)',
                      border: `1px solid ${r === 'pass' ? 'rgba(16,185,129,0.25)' : r === 'fail' ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
                    }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono mt-0.5 w-10 shrink-0" style={{ color: 'var(--text-4)' }}>{item.id}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-1)' }}>{item.text}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <WeightBadge weight={item.weight} />
                          {item.ref && (
                            <span className="text-xs" style={{ color: 'var(--text-4)' }}>{item.ref}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {[
                          { val: 'pass', icon: CheckCircle2, label: 'Pass', color: '#10B981', activeBg: 'rgba(16,185,129,0.15)' },
                          { val: 'fail', icon: XCircle, label: 'Fail', color: '#EF4444', activeBg: 'rgba(239,68,68,0.15)' },
                          { val: 'na', icon: MinusCircle, label: 'N/A', color: '#64748B', activeBg: 'rgba(100,116,139,0.15)' },
                        ].map(({ val, icon: Icon, label, color, activeBg }) => (
                          <button key={val} onClick={() => setResponse(item.id, val)}
                            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all text-xs font-semibold"
                            style={{
                              background: r === val ? activeBg : 'var(--surface-2)',
                              color: r === val ? color : 'var(--text-4)',
                              border: `1px solid ${r === val ? color + '40' : 'var(--border)'}`,
                              transform: r === val ? 'scale(1.05)' : 'scale(1)',
                            }}>
                            <Icon size={15} style={{ color: r === val ? color : 'var(--text-4)' }} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {r === 'fail' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 overflow-hidden">
                        <input
                          placeholder="Note the finding details (optional)..."
                          className="w-full text-xs px-3 py-2 rounded-lg border"
                          style={{ background: 'var(--surface-2)', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--text-2)' }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SubmissionRow({ sub }) {
  const [expanded, setExpanded] = useState(false);
  const score = sub.score || 0;
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';
  const responses = sub.responses || {};
  const passed = Object.values(responses).filter(r => r.result === 'pass').length;
  const failed = Object.values(responses).filter(r => r.result === 'fail').length;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:opacity-80 transition-opacity">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
          style={{ background: color + '20', color }}>
          {score}%
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{sub.branch_name || 'Unknown Location'}</p>
          <p className="text-xs" style={{ color: 'var(--text-4)' }}>{sub.inspector_name} · {new Date(sub.submitted_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="font-semibold text-emerald-600">{passed}✓</span>
          <span className="font-semibold text-red-500">{failed}✗</span>
          {sub.tickets_created > 0 && (
            <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
              {sub.tickets_created} tickets
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>{sub.status}</span>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-4)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(responses).filter(([, v]) => v.result === 'fail').slice(0, 8).map(([id, v]) => (
                  <div key={id} className="rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <XCircle size={11} className="text-red-500" />
                      <WeightBadge weight={v.weight} />
                    </div>
                    <p className="text-xs leading-snug mt-1" style={{ color: 'var(--text-3)' }}>{v.text}</p>
                  </div>
                ))}
              </div>
              {sub.notes && (
                <p className="text-xs mt-3 italic" style={{ color: 'var(--text-4)' }}>Note: {sub.notes}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InspectionEngine() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [atms, setAtms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startModal, setStartModal] = useState(null);
  const [inspecting, setInspecting] = useState(null);
  const [subCounts, setSubCounts] = useState({});

  const canInspect = ['admin', 'manager', 'auditor'].includes(profile?.role);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [tmpl, subs, br, atm] = await Promise.all([
        supabase.from('checklist_templates').select('*').eq('is_active', true).order('created_at'),
        supabase.from('checklist_submissions').select('*').order('submitted_at', { ascending: false }).limit(50),
        supabase.from('branches').select('id,name,emirate').order('name'),
        supabase.from('atms').select('id,name,emirate').order('name'),
      ]);
      setTemplates(tmpl.data || []);
      setSubmissions(subs.data || []);
      setBranches(br.data || []);
      setAtms(atm.data || []);

      // Count submissions per template
      const counts = {};
      (subs.data || []).forEach(s => { counts[s.template_id] = (counts[s.template_id] || 0) + 1; });
      setSubCounts(counts);
      setLoading(false);
    }
    load();
  }, []);

  const handleStart = (template) => setStartModal(template);
  const handleBegin = (targetId, note) => {
    setStartModal(null);
    setInspecting({ template: startModal, targetId, note });
    setActiveTab('form');
  };
  const handleDone = () => {
    setInspecting(null);
    setActiveTab('history');
    // Refresh submissions
    supabase.from('checklist_submissions').select('*').order('submitted_at', { ascending: false }).limit(50)
      .then(({ data }) => setSubmissions(data || []));
  };

  if (inspecting) {
    return (
      <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--header)' }}>
          <button onClick={() => { setInspecting(null); setActiveTab('templates'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
            ✕ Cancel
          </button>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{inspecting.template.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-4)' }}>Live Inspection — {new Date().toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <InspectionForm
            template={inspecting.template}
            targetId={inspecting.targetId}
            targetName={inspecting.targetId}
            inspectorNote={inspecting.note}
            profile={profile}
            branches={branches}
            atms={atms}
            onDone={handleDone}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Inspection Engine</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>Weighted compliance inspections with auto-ticket generation · W1–W5 severity scoring</p>
        </div>
        {!canInspect && (
          <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'rgba(234,179,8,0.12)', color: '#EAB308' }}>
            Read-only — auditor+ required to inspect
          </span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Templates', value: templates.length, color: '#2563EB', icon: ClipboardList },
          { label: 'Inspections Run', value: submissions.length, color: '#7C3AED', icon: CheckCircle2 },
          { label: 'Avg. Score', value: submissions.length > 0 ? Math.round(submissions.reduce((s, sub) => s + (sub.score || 0), 0) / submissions.length) + '%' : 'N/A', color: '#10B981', icon: Award },
          { label: 'Tickets Auto-Created', value: submissions.reduce((s, sub) => s + (sub.tickets_created || 0), 0), color: '#EF4444', icon: AlertTriangle },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-4)' }}>{kpi.label}</p>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-black" style={{ color: 'var(--text-1)' }}>{loading ? '—' : kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {[['templates', 'Templates'], ['history', 'Submission History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-3)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Templates tab */}
      {activeTab === 'templates' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-4)' }} />
              <p className="font-semibold" style={{ color: 'var(--text-2)' }}>No inspection templates found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-4)' }}>Run supabase-seed.sql to seed the inspection templates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {templates.map(t => (
                <TemplateCard key={t.id} template={t} submissionCount={subCounts[t.id] || 0}
                  onStart={canInspect ? handleStart : null} />
              ))}
            </div>
          )}

          {/* Weight legend */}
          <div className="mt-8 rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-4)' }}>Severity Weight Reference</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(WEIGHT_META).reverse().map(([key, meta]) => (
                <div key={key} className="rounded-xl p-3" style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm" style={{ color: meta.color }}>{key}</span>
                    <span className="text-xs font-bold" style={{ color: meta.color }}>×{meta.score}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: meta.color }}>{meta.label}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-4)' }}>SLA: {SLA_HOURS[key]}h</p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--text-4)' }}>
              Score = (Σ passed weights) / (Σ all weights) × 100.
              Open W5 findings cap score at 70%. Open W4 findings cap at 82%.
              Failed W3–W5 items auto-generate Incidents with SLA deadlines.
            </p>
          </div>
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-4)' }} />
              <p className="font-semibold" style={{ color: 'var(--text-2)' }}>No inspections submitted yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-4)' }}>Start your first inspection from the Templates tab</p>
              <button onClick={() => setActiveTab('templates')}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
                Go to Templates
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map(sub => <SubmissionRow key={sub.id} sub={sub} />)}
            </div>
          )}
        </div>
      )}

      {startModal && canInspect && (
        <StartModal template={startModal} branches={branches} atms={atms}
          onClose={() => setStartModal(null)} onStart={handleBegin} />
      )}
    </motion.div>
  );
}
