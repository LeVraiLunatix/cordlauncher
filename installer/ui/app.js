// Installateur de CordLauncher : accueil → progression → terminé (ou erreur).
const tauri = window.__TAURI__;
const invoke = (cmd, args) => (tauri ? tauri.core.invoke(cmd, args) : Promise.reject(new Error("Aperçu hors installateur.")));
const $ = (sel) => document.querySelector(sel);

const state = { dir: "", exe: null, info: null, busy: false };
const CIRCUMFERENCE = 540.35;

function show(name) {
  for (const screen of document.querySelectorAll("[data-screen]")) screen.hidden = screen.dataset.screen !== name;
}

function setProgress(value, stage) {
  const v = Math.max(0, Math.min(1, value));
  $("[data-ring]").style.strokeDashoffset = String(CIRCUMFERENCE * (1 - v));
  $("[data-percent]").textContent = `${Math.round(v * 100)} %`;
  if (stage) $("[data-stage]").textContent = stage;
}

async function init() {
  try {
    const info = await invoke("setup_info");
    state.info = info;
    state.dir = info.installedDir || info.defaultDir;
    $("[data-version]").textContent = `Version ${info.version} · bêta publique`;
    if (info.installedDir) {
      const same = info.installedVersion === info.version;
      $("[data-install-label]").textContent = same ? "Réinstaller" : "Mettre à jour";
      $("[data-note]").textContent = info.installedVersion
        ? `Déjà installé (version ${info.installedVersion}) · tes réglages et ton compte sont conservés`
        : "Déjà installé · tes réglages et ton compte sont conservés";
    }
  } catch {
    state.dir = "";
  }
  $("[data-dir]").textContent = state.dir || "Dossier par défaut";
  if (tauri) {
    await tauri.event.listen("setup://progress", (e) => setProgress(e.payload.value, e.payload.stage));
  }
}

async function install() {
  if (state.busy) return;
  state.busy = true;
  show("progress");
  setProgress(0, "Préparation");
  try {
    state.exe = await invoke("install", { dir: state.dir, shortcut: $("[data-shortcut]").checked });
    setProgress(1, "Terminé");
    await new Promise((r) => setTimeout(r, 500));
    show("done");
    if ($("[data-launch]").checked) setTimeout(() => void launch(), 1600);
  } catch (error) {
    $("[data-error]").textContent = String(error?.message ?? error);
    show("error");
  } finally {
    state.busy = false;
  }
}

async function launch() {
  if (!state.exe) return;
  try {
    await invoke("launch", { exe: state.exe });
    await tauri.window.getCurrentWindow().close();
  } catch (error) {
    $("[data-error]").textContent = String(error?.message ?? error);
    show("error");
  }
}

async function browse() {
  if (!tauri) return;
  const picked = await tauri.dialog.open({ directory: true, multiple: false, title: "Dossier d’installation de CordLauncher", defaultPath: state.dir || undefined });
  if (typeof picked === "string") {
    // Un sous-dossier dédié, comme le fait l'installateur par défaut.
    state.dir = /cordlauncher$/i.test(picked) ? picked : `${picked.replace(/[\\/]+$/, "")}\\CordLauncher`;
    $("[data-dir]").textContent = state.dir;
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "install" || action === "retry") void install();
  if (action === "launch") void launch();
  if (action === "browse") void browse();
  if (action === "options") {
    const panel = $("[data-options]");
    panel.hidden = !panel.hidden;
    target.setAttribute("aria-expanded", String(!panel.hidden));
    panel.closest(".screen").classList.toggle("with-options", !panel.hidden);
  }
  if (action === "minimize") void tauri?.window.getCurrentWindow().minimize();
  if (action === "close" && !state.busy) void tauri?.window.getCurrentWindow().close();
});

// Entrée = installer, comme un bouton par défaut.
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !$("[data-screen='welcome']").hidden) void install();
});

void init();
