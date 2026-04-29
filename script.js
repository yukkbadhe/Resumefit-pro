// Developed by Yukta Badhe
const els = {
  resumeText: document.getElementById("resumeText"),
  jobDescription: document.getElementById("jobDescription"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  sampleBtn: document.getElementById("sampleBtn"),
  scoreValue: document.getElementById("scoreValue"),
  meterBar: document.getElementById("meterBar"),
  keywordPct: document.getElementById("keywordPct"),
  sectionsFound: document.getElementById("sectionsFound"),
  impactCount: document.getElementById("impactCount"),
  matchedKeywords: document.getElementById("matchedKeywords"),
  missingKeywords: document.getElementById("missingKeywords"),
  suggestions: document.getElementById("suggestions"),
  rolePrediction: document.getElementById("rolePrediction"),
  themeToggle: document.getElementById("themeToggle"),
  resumeFile: document.getElementById("resumeFile")
};

function tokenize(text){
  return text.toLowerCase().match(/\b[a-z]+\b/g) || [];
}

function unique(arr){
  return [...new Set(arr)];
}

function detectRole(text){
  text = text.toLowerCase();
  if(text.includes("react") || text.includes("javascript")) return "Frontend Developer";
  if(text.includes("python") || text.includes("machine learning")) return "Data Analyst";
  if(text.includes("java")) return "Java Developer";
  return "General Software Engineer";
}

function updateColor(score){
  if(score < 40) els.scoreValue.style.color = "#dc2626";
  else if(score < 75) els.scoreValue.style.color = "#f59e0b";
  else els.scoreValue.style.color = "#10b981";
}

function analyze(){
  const resume = els.resumeText.value;
  const jd = els.jobDescription.value;

  const resumeWords = unique(tokenize(resume));
  const jdWords = unique(tokenize(jd));

  const matched = jdWords.filter(w => resumeWords.includes(w));
  const missing = jdWords.filter(w => !resumeWords.includes(w));

  const keywordScore = jdWords.length
    ? Math.round((matched.length / jdWords.length) * 100)
    : 0;

  const sections = ["summary","skills","experience","education","projects"]
    .filter(s => resume.toLowerCase().includes(s)).length;

  const impacts = (resume.match(/\d+%|\$\d+|\d+x/gi) || []).length;

  const finalScore = Math.round(
    keywordScore * 0.5 +
    (sections / 5) * 100 * 0.3 +
    Math.min(impacts * 20, 100) * 0.2
  );

  updateColor(finalScore);

  els.scoreValue.textContent = finalScore + "%";
  els.meterBar.style.width = finalScore + "%";
  els.keywordPct.textContent = keywordScore + "%";
  els.sectionsFound.textContent = sections + "/5";
  els.impactCount.textContent = impacts;

  els.matchedKeywords.innerHTML = matched.map(w =>
    `<span class="chip success">${w}</span>`).join("");

  els.missingKeywords.innerHTML = missing.map(w =>
    `<span class="chip">${w}</span>`).join("");

  const tips = [];
  if(missing.length) tips.push("Add missing keywords");
  if(sections < 4) tips.push("Add proper resume sections");
  if(impacts < 2) tips.push("Use measurable achievements");
  if(finalScore < 70) tips.push("Improve resume-job alignment");

  els.suggestions.innerHTML = tips.map(t =>
    `<span class="chip">${t}</span>`).join("");

  els.rolePrediction.innerHTML =
    `<span class="chip success">${detectRole(resume)}</span>`;
}

els.analyzeBtn.addEventListener("click", analyze);

els.sampleBtn.addEventListener("click", () => {
  els.resumeText.value = `
Summary
Yukta Badhe

Skills
HTML, CSS, JavaScript, React, SQL, GitHub

Experience
Developed responsive academic web systems.
Improved interface usability by 35%.

Projects
Resume ATS Checker
Portfolio Website

Education
Bachelor of Engineering in Computer Science
`;
});

els.themeToggle.addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
});

els.resumeFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = event => {
      els.resumeText.value = event.target.result;
    };
    reader.readAsText(file);
  }
});