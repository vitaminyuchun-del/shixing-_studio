const state = {
  lang: localStorage.getItem("shixing-lang") || "zh",
  projectFilter: "all",
  content: null,
};

const displayLevels = new Set(["full", "publicLink", "textOnly", "hidden"]);
const projectClassOrder = new Map([
  ["A", 1],
  ["GamePV", 2],
  ["ThreeD", 3],
  ["Support", 4],
  ["AIGC", 5],
  ["B", 6],
  ["", 7],
]);

const projectCapabilityNotes = {
  zh: {
    A: {
      label: "商业影像后期支持",
      body: "提供实拍合成、包装动画、画面修补与成片质感统一等支持。",
    },
    GamePV: {
      label: "动画包装案例",
      body: "为游戏PV和商业内容提供标题动画、图形动效与视觉风格包装。",
    },
    ThreeD: {
      label: "三维辅助与视觉设计",
      body: "以三维素材、科技视觉和画面设计补充商业影像表达。",
    },
    Support: {
      label: "大厂项目链路支持",
      body: "在公开项目链路中提供部分镜头包装、实拍合成、画面修补或视觉后期支持。",
    },
    AIGC: {
      label: "AIGC视觉实验",
      body: "针对AI生成素材进行画面质感优化、镜头统一与成片化测试。",
    },
    B: {
      label: "导演型影像实验",
      body: "围绕短片概念、AI素材整合与合成测试，探索导演型样片表达。",
    },
    default: {
      label: "合作支持",
      body: "可按镜头、阶段或整片方式提供灵活的商业影像视觉支持。",
    },
  },
  en: {
    A: {
      label: "Commercial Image Post Support",
      body: "Supports live-action compositing, motion packaging, cleanup, and finishing-quality unification.",
    },
    GamePV: {
      label: "Motion Packaging Case",
      body: "Provides title animation, graphic motion, and visual-style packaging for game PVs and commercial content.",
    },
    ThreeD: {
      label: "3D Support & Visual Design",
      body: "Uses 3D assets, technology visuals, and image design to support commercial image expression.",
    },
    Support: {
      label: "Major Client Pipeline Support",
      body: "Supports selected shots with packaging, live-action compositing, image cleanup, or visual post-production.",
    },
    AIGC: {
      label: "AIGC Visual Experiment",
      body: "Tests AI-generated material through image-quality enhancement, shot continuity, and delivery-oriented finishing.",
    },
    B: {
      label: "Director-led Image Experiment",
      body: "Explores director-led sample-film expression through short-film concepts, AI asset integration, and compositing tests.",
    },
    default: {
      label: "Collaboration Support",
      body: "Flexible commercial image support by shot, phase, or full-film scope.",
    },
  },
};

const fallbackCapabilities = [
  {
    title: {
      zh: "01 商业影像后期支持",
      en: "01 Commercial Image Post Support",
    },
    description: {
      zh: "实拍合成 / 瑕疵修复 / 穿帮擦除 / 镜头补充 / 成片统一",
      en: "Live-action compositing / cleanup / continuity repair / shot support / finishing unification",
    },
  },
  {
    title: {
      zh: "02 动画包装与视觉设计",
      en: "02 Motion Packaging & Visual Design",
    },
    description: {
      zh: "标题包装 / 图形动效 / 信息视觉化 / 发布会视觉 / 品牌内容包装",
      en: "Title packaging / graphic motion / information visualization / launch-event visuals / brand content packaging",
    },
  },
  {
    title: {
      zh: "03 AIGC视觉增强",
      en: "03 AIGC Visual Enhancement",
    },
    description: {
      zh: "AI素材修复 / 画面质感统一 / 镜头风格测试 / 概念影像开发 / 导演样片支持",
      en: "AI material repair / image-quality unification / shot-style testing / concept image development / director sample support",
    },
  },
];

let revealObserver = null;

const i18n = {
  zh: {
    nav: { work: "项目", motion: "能力", about: "关于", contact: "联系" },
    hero: {
      kicker: "TYC / 十行文化",
      title: "商业影像合成与 AIGC 视觉增强设计师",
      subtitle: "Motion Compositing / AIGC Visual Enhancement / Director-oriented Creator",
      lede: "为广告片、游戏PV、品牌影像与AI短片提供画面合成、瑕疵修复、动画包装、AIGC画面优化与成片质感统一。",
      ctaPrimary: "联系合作",
      ctaSecondary: "查看项目",
      reelLabel: "Featured Motion Reel",
    },
    motion: {
      title: "核心能力",
      body: "面向商业影像、品牌内容与AIGC影像实验，提供以下三类视觉支持。",
    },
    work: {
      title: "精选项目",
      body: "项目分为实拍合成、动画包装、三维辅助、大厂项目链路与 AIGC 实验。部分项目因客户版权限制，仅展示公开链接、职责说明或阶段性画面。",
      view: "查看详情",
      external: "外部链接",
      textOnly: "项目说明",
      filterAll: "全部",
      filterA: "商业影像合成",
      filterGamePV: "动画包装",
      filter3D: "三维辅助",
      filterSupport: "大厂项目链路",
      filterAIGC: "AIGC实验",
      filterB: "导演型实验",
      count: "个案例",
    },
    about: {
      title: "关于十行文化",
      body: "我是一名商业影像合成与动画包装设计师，目前以一人公司“十行文化”的形式承接项目。\n\n相比大型团队，十行文化更适合需要灵活协作、快速测试、远程执行和阶段性视觉支持的项目。我的工作重点不是单纯生成画面，而是把素材、实拍、动画与AIGC画面整合到可交付的商业成片质感中。不仅提供后期执行，也能参与前期视觉方向、镜头气质测试与AI概念样片开发。\n\n过往经历包括湖南广电体系工作、视觉内容公司合伙经营，以及长期服务上海视觉/内容制作公司，参与腾讯、米哈游等相关项目链路。",
    },
    contact: {
      title: "联系合作",
      body: "可合作方向：实拍合成、商业影像后期、动画包装、品牌视频、AIGC视觉增强、AI生成素材修复与成片质感统一。\n\n适合品牌短片、产品概念片、内容包装、发布会视觉与AIGC影像实验。适合远程项目制合作，可按镜头、阶段或整片支持方式协作。",
      flowTitle: "合作流程",
      flow1: "沟通项目需求与素材情况",
      flow2: "判断视觉方向、工作量与交付标准",
      flow3: "提供报价与制作周期",
      flow4: "制作测试或阶段性画面",
      flow5: "修改、统一并交付最终文件",
    },
  },
  en: {
    nav: { work: "Work", motion: "Capabilities", about: "About", contact: "Contact" },
    hero: {
      kicker: "TYC / Shixing Studio",
      title: "Commercial Compositing & AIGC Visual Enhancement Designer",
      subtitle: "Motion Compositing / AIGC Visual Enhancement / Director-oriented Creator",
      lede: "Image compositing, cleanup, motion packaging, AIGC image enhancement, and finishing-quality unification for commercials, game PVs, brand films, and AI short films.",
      ctaPrimary: "Start a Collaboration",
      ctaSecondary: "View Work",
      reelLabel: "Featured Motion Reel",
    },
    motion: {
      title: "Core Capabilities",
      body: "Three focused visual-support services for commercial images, brand content, and AIGC image experiments.",
    },
    work: {
      title: "Selected Projects",
      body: "Projects are grouped across live-action compositing, motion packaging, 3D support, major client pipelines, and AIGC experiments. Some projects are limited by client copyright and are shown through public links, role descriptions, or selected in-progress visuals.",
      view: "View Detail",
      external: "External Link",
      textOnly: "Project Note",
      filterAll: "All",
      filterA: "Commercial Compositing",
      filterGamePV: "Motion Packaging",
      filter3D: "3D Support",
      filterSupport: "Major Client Pipelines",
      filterAIGC: "AIGC Experiments",
      filterB: "Director-led Experiments",
      count: "cases",
    },
    about: {
      title: "About Shixing Studio",
      body: "I am a commercial image compositing and motion packaging designer, currently taking on projects through my one-person company, Shixing Studio.\n\nCompared with a large team, Shixing Studio is better suited for projects that need flexible collaboration, quick visual tests, remote execution, and phase-based visual support. My focus is not simply generating images, but integrating assets, live-action footage, animation, and AIGC visuals into deliverable commercial finishing quality. Beyond post-production execution, I can also participate in early visual direction, shot-tone testing, and AI concept sample development.\n\nMy background includes work within the Hunan Broadcasting System, partnership operation in a visual content company, long-term support for Shanghai visual/content production companies, and project pipelines connected to Tencent, miHoYo, and related clients.",
    },
    contact: {
      title: "Contact",
      body: "Collaboration areas: live-action compositing, commercial image post-production, motion packaging, brand videos, AIGC visual enhancement, AI-generated material repair, and finishing-quality unification.\n\nSuitable for brand films, product concept films, content packaging, launch-event visuals, and AIGC image experiments. Remote project-based collaboration is welcome, with support by shot, phase, or full-film scope.",
      flowTitle: "Workflow",
      flow1: "Discuss project needs and source material",
      flow2: "Assess visual direction, workload, and delivery standards",
      flow3: "Provide quote and production timeline",
      flow4: "Create tests or phase-based visuals",
      flow5: "Revise, unify, and deliver final files",
    },
  },
};

async function boot() {
  try {
    const response = await fetch(`content/site.json?v=${Date.now()}`, { cache: "no-store" });
    state.content = await response.json();
  } catch (error) {
    console.error("Could not load content/site.json", error);
    state.content = { projects: [], capabilities: [], facts: [], contacts: [] };
  }

  bindEvents();
  render();
}

function t(path) {
  return path.split(".").reduce((value, key) => value?.[key], i18n[state.lang]) || path;
}

function localize(value) {
  if (!value || typeof value !== "object") return value || "";
  return value[state.lang] || value.zh || value.en || "";
}

function bindEvents() {
  document.querySelector(".language-toggle")?.addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    localStorage.setItem("shixing-lang", state.lang);
    render();
  });

  document.querySelector("[data-close-dialog]")?.addEventListener("click", closeDialog);
  document.querySelector("[data-media-dialog]")?.addEventListener("click", (event) => {
    if (event.target.matches("[data-media-dialog]")) closeDialog();
  });
  document.querySelector("[data-open-featured]")?.addEventListener("click", () => {
    const reel = state.content?.featuredReel;
    openMedia({
      title: reel?.title,
      description: reel?.description,
      video: reel?.video,
      image: reel?.poster || "assets/brand/bg-grid-dark.png",
    });
  });
}

function render() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.querySelector("[data-lang-label]").textContent = state.lang === "zh" ? "EN" : "中";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  renderFeaturedReel();
  renderCapabilities();
  renderProjectFilters();
  renderProjects();
  renderFacts();
  renderContacts();
  setupRevealAnimations();
}

function renderFeaturedReel() {
  const container = document.querySelector("[data-featured-reel]");
  const reel = state.content?.featuredReel;
  if (!container) return;

  const existing = container.querySelector("video");
  if (existing) existing.remove();
  const existingImage = container.querySelector(":scope > img");
  if (existingImage) existingImage.remove();

  const placeholder = container.querySelector(".motion-placeholder");
  if (placeholder) placeholder.hidden = Boolean(reel?.video || reel?.poster);

  if (reel?.video) {
    const video = document.createElement("video");
    video.src = reel.video;
    video.poster = reel.poster || "";
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";
    container.prepend(video);
    return;
  }

  if (reel?.poster) {
    const image = document.createElement("img");
    image.src = reel.poster;
    image.alt = localize(reel.title);
    container.prepend(image);
  }
}

function renderCapabilities() {
  const grid = document.querySelector("[data-capabilities]");
  if (!grid) return;

  const capabilities = state.content?.capabilities?.length ? state.content.capabilities : fallbackCapabilities;
  grid.innerHTML = capabilities.map((item) => `
    <article class="capability-item">
      <div class="capability-icon" aria-hidden="true"><span></span></div>
      <h3>${localize(item.title)}</h3>
      <p>${localize(item.description)}</p>
    </article>
  `).join("");
}

function renderProjects() {
  const grid = document.querySelector("[data-projects]");
  if (!grid) return;

  const projects = getFilteredProjects();
  grid.innerHTML = projects.map(({ project, index }, position) => `
    <article class="${getProjectCardClass(project, position)}">
      ${renderProjectMediaButton(project, index)}
      <div class="project-info">
        <div class="project-meta">
          <span>${project.year}</span>
          <span>${project.client ? localize(project.client) : localize(project.role)}</span>
        </div>
        <h3>${localize(project.title)}</h3>
        ${project.client ? `<p class="project-role">${localize(project.role)}</p>` : ""}
        ${renderProjectCapability(project)}
        <p>${localize(project.summary)}</p>
        ${renderProjectNote(project)}
        <div class="project-actions">
          <button class="mini-link" type="button" data-project-index="${index}">${t("work.view")}</button>
          ${(project.externalLinks || []).slice(0, 1).map((link) => `
            <a class="mini-link" href="${link.url}" target="_blank" rel="noreferrer">${localize(link.label) || t("work.external")}</a>
          `).join("")}
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-project-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = state.content.projects[Number(button.dataset.projectIndex)];
      openProject(project);
    });
  });
}

function renderProjectCapability(project) {
  const note = projectCapabilityNotes[state.lang][project?.caseClass] || projectCapabilityNotes[state.lang].default;
  return `
    <div class="project-capability">
      <span>${note.label}</span>
      <p>${note.body}</p>
    </div>
  `;
}

function getProjectCardClass(project, position) {
  return [
    "project-card",
    getProjectDisplayLevel(project) === "textOnly" ? "is-text-only" : "",
    state.projectFilter === "all" && position < 2 ? "is-featured-project" : "",
  ].filter(Boolean).join(" ");
}

function renderProjectFilters() {
  const toolbar = document.querySelector("[data-project-filters]");
  if (!toolbar) return;

  const filters = [
    { value: "all", label: t("work.filterAll") },
    { value: "A", label: t("work.filterA") },
    { value: "GamePV", label: t("work.filterGamePV") },
    { value: "ThreeD", label: t("work.filter3D") },
    { value: "Support", label: t("work.filterSupport") },
    { value: "AIGC", label: t("work.filterAIGC") },
    { value: "B", label: t("work.filterB") },
  ];

  const activeCount = getFilteredProjects().length;
  toolbar.innerHTML = `
    <div class="filter-buttons" role="list" aria-label="${state.lang === "zh" ? "项目筛选" : "Project filters"}">
      ${filters.map((filter) => `
        <button class="filter-button" type="button" data-project-filter="${filter.value}" aria-pressed="${state.projectFilter === filter.value}">
          ${filter.label}
        </button>
      `).join("")}
    </div>
    <p class="project-count">${activeCount} ${t("work.count")}</p>
  `;

  toolbar.querySelectorAll("[data-project-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.projectFilter = button.dataset.projectFilter;
      renderProjectFilters();
      renderProjects();
      requestAnimationFrame(setupRevealAnimations);
    });
  });
}

function getFilteredProjects() {
  return getVisibleProjects()
    .filter(({ project }) => state.projectFilter === "all" || project.caseClass === state.projectFilter);
}

function getVisibleProjects() {
  return (state.content.projects || [])
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => getProjectDisplayLevel(project) !== "hidden")
    .sort((a, b) => getProjectSortValue(a.project, a.index) - getProjectSortValue(b.project, b.index));
}

function getProjectSortValue(project, index) {
  const classOrder = projectClassOrder.get(project?.caseClass || "") || 99;
  return classOrder * 10000 + index;
}

function getProjectDisplayLevel(project) {
  if (displayLevels.has(project?.displayLevel)) return project.displayLevel;
  return project?.externalLinks?.length ? "publicLink" : "textOnly";
}

function canShowProjectMedia(project) {
  return getProjectDisplayLevel(project) !== "textOnly";
}

function canPlayProjectVideo(project) {
  return getProjectDisplayLevel(project) === "full";
}

function renderProjectMediaButton(project, index) {
  if (!canShowProjectMedia(project)) {
    return `
      <button class="project-text-trigger" type="button" data-project-index="${index}" aria-label="${localize(project.title)}">
        <span>${t("work.textOnly")}</span>
      </button>
    `;
  }

  return `
    <button class="project-media" type="button" data-project-index="${index}" aria-label="${localize(project.title)}">
      ${renderProjectMedia(project)}
      <span class="media-badge">${project.mediaType || "mixed"}</span>
    </button>
  `;
}

function renderProjectMedia(project) {
  if (canPlayProjectVideo(project) && project.coverVideo) {
    return `<video src="${project.coverVideo}" poster="${project.coverImage || ""}" muted loop autoplay playsinline preload="metadata"></video>`;
  }
  if (project.coverImage) {
    return `<img src="${project.coverImage}" alt="${localize(project.title)}" loading="lazy">`;
  }
  return `<div class="project-media-fallback">${localize(project.title)}</div>`;
}

function renderProjectNote(project) {
  const note = project.displayNote || project.sourceNote;
  return note ? `<p class="source-note">${localize(note)}</p>` : "";
}

function openProject(project) {
  const level = getProjectDisplayLevel(project);
  const externalLinks = project.externalLinks || [];

  openMedia({
    title: project.title,
    description: project.detail,
    note: project.displayNote || project.sourceNote,
    video: level === "full" ? project.videoUrl || project.coverVideo || project.motionClips?.[0]?.src : "",
    image: level === "textOnly" ? "" : project.coverImage || project.gallery?.[0],
    gallery: level === "full" ? project.gallery : level === "publicLink" ? (project.gallery || []).slice(0, 3) : [],
    motionClips: level === "full" ? project.motionClips : [],
    externalLinks,
  });
}

function renderFacts() {
  const list = document.querySelector("[data-facts]");
  if (!list) return;

  list.innerHTML = buildCareerTimeline(state.content.facts || []).map((item, index) => `
    <li>
      <span class="timeline-marker">${String(index + 1).padStart(2, "0")}</span>
      <div class="timeline-copy">
        <h3>${item.label}</h3>
        <p>${item.value}</p>
      </div>
    </li>
  `).join("");
}

function buildCareerTimeline(facts) {
  const careerLabels = state.lang === "zh"
    ? ["湖南广电经历", "合伙公司经历", "一人公司"]
    : ["Hunan Broadcasting", "Partnership Company", "One-person Company"];

  return facts.flatMap((fact) => {
    const label = localize(fact.label);
    const value = localize(fact.value);
    const normalizedLabel = label.toLowerCase();
    if (!label || !value || label.includes("主理人") || normalizedLabel.includes("founder")) return [];

    if (label.includes("履历") || normalizedLabel.includes("career")) {
      return value.split(/\s*\/\s*/).filter(Boolean).map((part, index) => ({
        label: careerLabels[index] || label,
        value: part.trim(),
      }));
    }

    return [{ label, value }];
  });
}

function renderContacts() {
  const list = document.querySelector("[data-contact-links]");
  if (!list) return;

  list.innerHTML = state.content.contacts.map((contact) => {
    const body = `<span class="contact-label">${localize(contact.label)}</span>${localize(contact.value)}`;
    if (contact.href) {
      return `<a href="${contact.href}">${body}</a>`;
    }
    return `<span>${body}</span>`;
  }).join("");
}

function openMedia(item) {
  const dialog = document.querySelector("[data-media-dialog]");
  const body = document.querySelector("[data-dialog-body]");
  if (!dialog || !body) return;

  const gallery = (item.gallery || []).filter(Boolean);
  const clips = (item.motionClips || []).filter((clip) => clip?.src);
  const media = item.video
    ? `<div class="dialog-hero-media"><video src="${item.video}" poster="${item.image || ""}" controls autoplay playsinline></video></div>`
    : item.image
      ? `<div class="dialog-hero-media"><img src="${item.image}" alt="${localize(item.title)}"></div>`
      : "";
  const galleryMedia = gallery.length > 1
    ? `<div class="media-strip-label">Stills / Frames</div>
      <div class="dialog-gallery media-strip">
        ${gallery.map((src) => `<figure><img src="${src}" alt="${localize(item.title)}"></figure>`).join("")}
      </div>`
    : "";
  const clipMedia = clips.length > 1
    ? `<div class="media-strip-label">Motion Clips</div>
      <div class="dialog-clips media-strip">
        ${clips.map((clip) => `<figure><button class="clip-select" type="button" data-clip-src="${clip.src}" data-clip-poster="${clip.poster || item.image || ""}" aria-label="Play clip in main viewer"><video src="${clip.src}" poster="${clip.poster || item.image || ""}" muted loop playsinline preload="metadata" data-preview-video></video></button></figure>`).join("")}
      </div>`
    : "";
  const externalLinks = (item.externalLinks || []).length
    ? `<div class="dialog-links">
        ${(item.externalLinks || []).map((link) => `<a class="mini-link" href="${link.url}" target="_blank" rel="noreferrer">${localize(link.label) || t("work.external")}</a>`).join("")}
      </div>`
    : "";
  const note = item.note ? `<p class="source-note">${localize(item.note)}</p>` : "";

  body.innerHTML = `
    ${media}
    <div class="dialog-copy">
      <h3>${localize(item.title)}</h3>
      <p>${localize(item.description)}</p>
      ${note}
      ${externalLinks}
    </div>
    ${galleryMedia}
    ${clipMedia}
  `;
  const heroMedia = body.querySelector(".dialog-hero-media");
  body.querySelectorAll("[data-preview-video]").forEach((video) => {
    video.addEventListener("mouseenter", () => video.play().catch(() => {}));
    video.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });
  body.querySelectorAll(".clip-select").forEach((button) => {
    button.addEventListener("click", () => {
      body.querySelectorAll("[data-preview-video]").forEach((preview) => {
        preview.pause();
        preview.currentTime = 0;
      });
      if (!heroMedia) return;
      heroMedia.innerHTML = `<video src="${button.dataset.clipSrc}" poster="${button.dataset.clipPoster || item.image || ""}" controls autoplay playsinline></video>`;
      heroMedia.querySelector("video")?.play().catch(() => {});
    });
  });
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.querySelector("[data-media-dialog]");
  document.querySelector("[data-dialog-body]").innerHTML = "";
  dialog?.close();
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".capability-item, .project-card, .career-timeline li, .contact-links > *");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.14,
  });

  items.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 40, 360)}ms`);
    revealObserver.observe(item);
  });
}

boot();
