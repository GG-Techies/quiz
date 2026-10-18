export const ZONE = 'America/Sao_Paulo';
export function formatEpisodeNumber(value) {
  if (!Number.isSafeInteger(value) || value < 1) throw new TypeError('Episode number must be a positive safe integer');
  return String(value).padStart(3, '0');
}
export function dayKey(date = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function shiftDay(day, offset) { const date = new Date(`${day}T12:00:00Z`); date.setUTCDate(date.getUTCDate()+offset); return date.toISOString().slice(0,10); }
export function cleanProgress(value, episode) {
  const p = value && typeof value === 'object' ? value : {};
  const answers = [];
  if (p.id === episode.id && Array.isArray(p.answers)) for (const answer of p.answers.slice(0,5)) { if (!Number.isInteger(answer) || answer<0 || answer>2) break; answers.push(answer); }
  return {id:episode.id, answers, seen: Math.min(answers.length, Math.max(0, Number.isInteger(p.seen)?p.seen:0)), started:p.started===true || answers.length>0};
}
export function score(episode, progress) { return progress.answers.reduce((n,a,i)=>n+(a === 'ABC'.indexOf(episode.questions[i].correct_answer)?1:0),0); }
export function recordAnswer(episode, progress, answer) {
  if (progress.answers.length >= 5 || progress.seen !== progress.answers.length || !Number.isInteger(answer) || answer<0 || answer>2) return progress;
  return {...progress,started:true,answers:[...progress.answers,answer]};
}
export function streak(days, today) { const set=new Set(days); let d=set.has(today)?today:shiftDay(today,-1); let n=0; while(set.has(d)){n++;d=shiftDay(d,-1);} return n; }
export function shareText(episode, progress, url) { return `🎯 Bora Valendo! • Desafio #${formatEpisodeNumber(episode.number)}\n${progress.answers.map((a,i)=>a==='ABC'.indexOf(episode.questions[i].correct_answer)?'🟩':'🟥').join('')}\nAcertei ${score(episode,progress)}/5. E você?\n${url}`; }
