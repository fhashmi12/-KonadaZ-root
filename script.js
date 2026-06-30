// ===================== BOOT SEQUENCE =====================
const bootLines = [
  "INITIALIZING KONADAZ-OS...",
  "[OK] Loading kernel modules",
  "[OK] Mounting /home/faraz",
  "[OK] Establishing secure shell",
  "[OK] Decrypting portfolio.bin",
  "",
  "WELCOME, OPERATOR.",
  ""
];

const bootTextEl = document.getElementById('boot-text');
let bootIndex = 0;
let charIndex = 0;

function typeBoot() {
  if (bootIndex >= bootLines.length) {
    setTimeout(finishBoot, 500);
    return;
  }
  const line = bootLines[bootIndex];
  if (charIndex <= line.length) {
    bootTextEl.textContent = bootLines.slice(0, bootIndex).join('\n') + (bootIndex > 0 ? '\n' : '') + line.slice(0, charIndex);
    charIndex++;
    setTimeout(typeBoot, line.length === 0 ? 80 : 14);
  } else {
    bootIndex++;
    charIndex = 0;
    setTimeout(typeBoot, 120);
  }
}

function finishBoot() {
  const boot = document.getElementById('boot');
  boot.classList.add('fade-out');
  document.getElementById('main-nav').classList.remove('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  setTimeout(() => boot.remove(), 700);
}

// Respect reduced motion: skip boot animation but keep the moment brief
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  bootTextEl.textContent = bootLines.join('\n');
  setTimeout(finishBoot, 400);
} else {
  typeBoot();
}

// ===================== ATTACK CHAIN =====================
const chainData = [
  {
    title: "STAGE 00 // RECONNAISSANCE",
    body: "Passive and active information gathering on the target environment — open-source intelligence, DNS enumeration, port scanning, and service fingerprinting to build a map of the attack surface before touching anything sensitive."
  },
  {
    title: "STAGE 01 // EXPLOITATION",
    body: "Identifying and validating a foothold using a known vulnerability or misconfiguration. This stage is about proving impact safely and documenting exactly how access was gained, not just that it was."
  },
  {
    title: "STAGE 02 // LATERAL MOVEMENT",
    body: "Pivoting from the initial foothold toward higher-value assets — credential reuse, privilege escalation, and mapping internal trust relationships an attacker could exploit to widen their reach."
  },
  {
    title: "STAGE 03 // DETECTION",
    body: "Switching hats: reviewing logs, alerts, and telemetry to see what a SOC analyst would have caught. Where did the attack chain leave a trace, and where did it slip past existing controls?"
  },
  {
    title: "STAGE 04 // REMEDIATION",
    body: "Translating findings into a prioritized, risk-rated report — concrete fixes, compensating controls, and governance recommendations so the same path can't be walked again."
  }
];

const chainNodes = document.querySelectorAll('.chain-node');
const chainDetail = document.getElementById('chain-detail');

chainNodes.forEach(node => {
  node.addEventListener('click', () => {
    const stage = parseInt(node.dataset.stage);
    chainNodes.forEach((n, i) => {
      n.classList.remove('active');
      if (i < stage) n.classList.add('compromised');
      else if (i > stage) n.classList.remove('compromised');
    });
    node.classList.add('active');
    node.classList.add('compromised');

    const data = chainData[stage];
    chainDetail.innerHTML = `
      <div class="detail-stage-title">${data.title}</div>
      <div class="detail-stage-body">${data.body}</div>
    `;
  });
});

// ===================== SKILL BARS =====================
const skills = [
  { label: "Penetration Testing", value: 62, color: "var(--magenta)" },
  { label: "SOC / Detection", value: 58, color: "var(--cyan)" },
  { label: "GRC / Risk & Compliance", value: 50, color: "var(--amber)" },
  { label: "Cloud Security (GCP/AWS)", value: 45, color: "var(--cyan)" },
  { label: "Scripting (Python/Bash)", value: 55, color: "var(--magenta)" },
];

const skillBarsEl = document.getElementById('skill-bars');
skills.forEach(s => {
  const row = document.createElement('div');
  row.className = 'skill-bar-row';
  row.innerHTML = `
    <div class="skill-bar-label"><span>${s.label}</span><span>${s.value}%</span></div>
    <div class="skill-bar-track"><div class="skill-bar-fill" style="background:${s.color}"></div></div>
  `;
  skillBarsEl.appendChild(row);
});

// Animate bars when scrolled into view
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = document.querySelectorAll('.skill-bar-fill');
      fills.forEach((fill, i) => {
        fill.style.width = skills[i].value + '%';
      });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
skillObserver.observe(document.getElementById('dashboard'));

// ===================== ALERT FEED =====================
const alertMessages = [
  { lvl: "info", text: "Lab environment spun up — TryHackMe room initialized" },
  { lvl: "info", text: "Nmap scan completed — 4 open ports identified" },
  { lvl: "warn", text: "Outdated SMB version flagged for review" },
  { lvl: "info", text: "Wireshark capture saved for analysis" },
  { lvl: "info", text: "Risk register updated — control gap logged" },
  { lvl: "warn", text: "Unpatched CVE noted in pentest report draft" },
  { lvl: "info", text: "GCP IAM policy reviewed for least privilege" },
  { lvl: "info", text: "Python recon script committed to repo" },
];

const alertFeedEl = document.getElementById('alert-feed');
let alertIdx = 0;

function pushAlert() {
  const a = alertMessages[alertIdx % alertMessages.length];
  const now = new Date();
  const ts = now.toTimeString().slice(0, 8);
  const line = document.createElement('div');
  line.className = 'alert-line';
  line.innerHTML = `<span class="ts">[${ts}]</span> <span class="lvl-${a.lvl}">${a.lvl.toUpperCase()}</span> ${a.text}`;
  alertFeedEl.prepend(line);
  while (alertFeedEl.children.length > 6) {
    alertFeedEl.removeChild(alertFeedEl.lastChild);
  }
  alertIdx++;
}

pushAlert();
setInterval(pushAlert, 3200);

// ===================== RADAR CHART =====================
function drawRadar() {
  const svg = document.getElementById('radar-chart');
  const center = 150, radius = 110;
  const labels = ["Pentest", "SOC", "GRC", "Cloud", "Scripting"];
  const values = [0.62, 0.58, 0.5, 0.45, 0.55];
  const n = labels.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  let svgContent = '';

  // grid rings
  [0.25, 0.5, 0.75, 1].forEach(r => {
    let points = [];
    for (let i = 0; i < n; i++) {
      const a = angle(i);
      points.push(`${center + Math.cos(a) * radius * r},${center + Math.sin(a) * radius * r}`);
    }
    svgContent += `<polygon points="${points.join(' ')}" fill="none" stroke="rgba(124,138,174,0.2)" stroke-width="1"/>`;
  });

  // axis lines + labels
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    const x2 = center + Math.cos(a) * radius;
    const y2 = center + Math.sin(a) * radius;
    svgContent += `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="rgba(124,138,174,0.2)" stroke-width="1"/>`;
    const lx = center + Math.cos(a) * (radius + 22);
    const ly = center + Math.sin(a) * (radius + 22);
    svgContent += `<text x="${lx}" y="${ly}" fill="#7C8AAE" font-family="JetBrains Mono" font-size="10" text-anchor="middle" dominant-baseline="middle">${labels[i]}</text>`;
  }

  // data polygon
  let dataPoints = [];
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    dataPoints.push(`${center + Math.cos(a) * radius * values[i]},${center + Math.sin(a) * radius * values[i]}`);
  }
  svgContent += `<polygon points="${dataPoints.join(' ')}" fill="rgba(39,242,224,0.15)" stroke="#27F2E0" stroke-width="2"/>`;

  for (let i = 0; i < n; i++) {
    const a = angle(i);
    const px = center + Math.cos(a) * radius * values[i];
    const py = center + Math.sin(a) * radius * values[i];
    svgContent += `<circle cx="${px}" cy="${py}" r="3.5" fill="#FF2BD6"/>`;
  }

  svg.innerHTML = svgContent;
}
drawRadar();

// ===================== CASE FILES =====================
const cases = [
  {
    id: "CASE-0117 // PENTEST",
    title: "Internal Network Penetration Test (Lab)",
    summary: "Simulated internal pentest against a vulnerable lab network — enumerated services, exploited a misconfigured SMB share, and escalated to domain admin.",
    tools: ["Nmap", "Metasploit", "BloodHound", "Mimikatz"],
    detail: "Performed full reconnaissance against a multi-host lab environment, identified an unauthenticated SMB share exposing credentials, and used BloodHound to map an attack path to domain admin. Findings were documented in a formal report including remediation steps for share permissions and credential hygiene.",
    status: "RESOLVED"
  },
  {
    id: "CASE-0204 // SOC",
    title: "SIEM Alert Triage Simulation",
    summary: "Worked through simulated SOC alert queues, triaging false positives and escalating a genuine brute-force attempt.",
    tools: ["Splunk", "Sysmon", "MITRE ATT&CK"],
    detail: "Reviewed a queue of generated alerts in a SIEM sandbox, mapped suspicious activity to MITRE ATT&CK techniques, and correctly distinguished a credential brute-force attempt from noisy false positives, writing up an incident summary with recommended containment steps.",
    status: "RESOLVED"
  },
  {
    id: "CASE-0309 // GRC",
    title: "Risk Assessment & Control Mapping",
    summary: "Built a sample risk register for a fictional small business, mapping identified risks to NIST CSF and ISO 27001 controls.",
    tools: ["NIST CSF", "ISO 27001", "Excel"],
    detail: "Created a practice risk register identifying common small-business risk scenarios (phishing, weak access control, unpatched systems), scored them by likelihood and impact, and mapped each to corresponding NIST CSF and ISO 27001 controls with suggested remediation owners.",
    status: "ACTIVE"
  },
  {
    id: "CASE-0415 // CLOUD",
    title: "GCP IAM Least-Privilege Audit",
    summary: "Audited a sample GCP project's IAM bindings, flagging over-permissioned service accounts and proposing tighter roles.",
    tools: ["GCP IAM", "gcloud CLI", "Terraform"],
    detail: "Reviewed IAM policy bindings on a personal GCP sandbox project, identified service accounts holding Editor-level access where a custom least-privilege role would suffice, and rewrote the relevant Terraform to apply scoped roles instead.",
    status: "ACTIVE"
  },
];

const caseGrid = document.getElementById('case-grid');
cases.forEach(c => {
  const card = document.createElement('div');
  card.className = 'case-card';
  card.innerHTML = `
    <div class="case-id">${c.id}</div>
    <div class="case-title">${c.title}</div>
    <div class="case-summary">${c.summary}</div>
    <div class="case-tools">${c.tools.map(t => `<span class="case-tool-pill">${t}</span>`).join('')}</div>
    <div class="case-status ${c.status === 'RESOLVED' ? 'status-resolved' : 'status-active'}">STATUS: ${c.status}</div>
    <div class="case-expand-body">${c.detail}</div>
  `;
  card.addEventListener('click', () => card.classList.toggle('expanded'));
  caseGrid.appendChild(card);
});

// ===================== TERMINAL =====================
const termInput = document.getElementById('term-input');
const termHistory = document.getElementById('term-history');

const commands = {
  help: () => `Available commands: whoami, skills, projects, certs, contact, clear`,
  whoami: () => `Faraz Hashmi (KonadaZ) — Aspiring Cybersecurity Professional.\nFocused on pentesting, SOC operations, and GRC.`,
  skills: () => `Pentesting · SOC Operations · GRC · Cloud Security (GCP/AWS) · Python & Bash scripting`,
  projects: () => `See the Case Files section above for detailed write-ups. Run 'help' for more.`,
  certs: () => `Currently studying toward industry certifications. Check back soon — this section updates as I progress.`,
  contact: () => `Scroll to the bottom of the page, or find links under "Establish Connection."`,
  clear: () => null,
};

function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  const echoLine = document.createElement('div');
  echoLine.className = 'term-output';
  echoLine.innerHTML = `<span class="t-accent">root@konadaz:~$</span> ${raw}`;
  termHistory.appendChild(echoLine);

  if (cmd === 'clear') {
    termHistory.innerHTML = '';
    return;
  }

  const handler = commands[cmd];
  const output = document.createElement('div');
  output.className = 'term-output' + (handler ? '' : ' err');
  output.style.whiteSpace = 'pre-wrap';
  output.textContent = handler ? handler() : `command not found: ${raw}. Type 'help' for options.`;
  termHistory.appendChild(output);

  termHistory.parentElement.scrollTop = termHistory.parentElement.scrollHeight;
}

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && termInput.value.trim() !== '') {
    runCommand(termInput.value);
    termInput.value = '';
  }
});

// Focus terminal input when clicking anywhere in terminal body
document.getElementById('terminal-body').addEventListener('click', () => termInput.focus());

// ===================== CONTACT LINKS =====================
// Replace these placeholder hrefs with real links
document.getElementById('link-email').href = "mailto:youremail@example.com";
document.getElementById('link-linkedin').href = "https://linkedin.com/in/your-profile";
document.getElementById('link-github').href = "https://github.com/your-username";
