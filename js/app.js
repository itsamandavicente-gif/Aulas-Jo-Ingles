(function () {
  var STORAGE_KEY = "missoes-aulas-v1";
  var STATUS_CYCLE = ["Pendente", "Em andamento", "Concluído"];

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) { return {}; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();
  COURSE_DATA.forEach(function (item) {
    if (!state[item.id]) state[item.id] = { status: "Pendente", nota: "" };
  });

  var filters = { search: "", status: "Todas", prioridade: "Todas" };

  var iconCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var iconDot = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>';
  var iconNote = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

  function statusIcon(status) {
    if (status === "Concluído") return iconCheck;
    if (status === "Em andamento") return iconDot;
    return "";
  }

  function counts(items) {
    var c = { Pendente: 0, "Em andamento": 0, "Concluído": 0 };
    items.forEach(function (i) { c[state[i.id].status]++; });
    return c;
  }

  function renderOverview() {
    var total = COURSE_DATA.length;
    var c = counts(COURSE_DATA);
    var pct = total ? Math.round((c["Concluído"] / total) * 100) : 0;
    document.getElementById("ov-pct").textContent = pct + "%";
    document.getElementById("ov-frac").textContent = c["Concluído"] + " / " + total + " concluídas";
    document.getElementById("stat-pending").textContent = c["Pendente"];
    document.getElementById("stat-progress").textContent = c["Em andamento"];
    document.getElementById("stat-done").textContent = c["Concluído"];
    document.getElementById("ov-bar-done").style.width = (total ? c["Concluído"] / total * 100 : 0) + "%";
    document.getElementById("ov-bar-progress").style.width = (total ? c["Em andamento"] / total * 100 : 0) + "%";
  }

  function renderStageCards() {
    var stages = [];
    var seen = {};
    COURSE_DATA.forEach(function (item) {
      if (!seen[item.etapa]) { seen[item.etapa] = true; stages.push({ key: item.etapa, nome: item.etapaNome }); }
    });
    var el = document.getElementById("stage-cards");
    el.innerHTML = "";
    stages.forEach(function (stage) {
      var items = COURSE_DATA.filter(function (i) { return i.etapa === stage.key; });
      var c = counts(items);
      var total = items.length;
      var card = document.createElement("div");
      card.className = "stage-card";
      card.innerHTML =
        '<div class="stage-name">' + stage.key + ' — ' + stage.nome + '</div>' +
        '<div class="stage-count">' + c["Concluído"] + ' / ' + total + ' concluídas</div>' +
        '<div class="bar-track">' +
        '<div class="bar-seg done" style="width:' + (c["Concluído"] / total * 100) + '%"></div>' +
        '<div class="bar-seg progress" style="width:' + (c["Em andamento"] / total * 100) + '%"></div>' +
        '</div>';
      el.appendChild(card);
    });
  }

  function matchesFilters(item) {
    var s = state[item.id];
    if (filters.status !== "Todas" && s.status !== filters.status) return false;
    if (filters.prioridade !== "Todas" && item.prioridade !== filters.prioridade) return false;
    if (filters.search) {
      var q = filters.search.toLowerCase();
      if (item.titulo.toLowerCase().indexOf(q) === -1 && item.pasta.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  }

  function cycleStatus(current) {
    var idx = STATUS_CYCLE.indexOf(current);
    return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
  }

  function renderMissions() {
    var container = document.getElementById("mission-groups");
    container.innerHTML = "";

    var stages = [];
    var seen = {};
    COURSE_DATA.forEach(function (item) {
      if (!seen[item.etapa]) { seen[item.etapa] = true; stages.push({ key: item.etapa, nome: item.etapaNome }); }
    });

    var anyVisible = false;

    stages.forEach(function (stage) {
      var items = COURSE_DATA.filter(function (i) { return i.etapa === stage.key; });
      var visibleItems = items.filter(matchesFilters);
      if (visibleItems.length === 0) return;
      anyVisible = true;

      var group = document.createElement("div");
      group.className = "etapa-group";

      var c = counts(items);
      group.innerHTML = '<div class="etapa-header"><div class="name">' + stage.key + ' — ' + stage.nome + '</div><div class="count">' + c["Concluído"] + ' / ' + items.length + '</div></div>';

      var list = document.createElement("div");
      list.className = "mission-list";

      visibleItems.forEach(function (item) {
        var s = state[item.id];
        var mission = document.createElement("div");
        mission.className = "mission";
        mission.setAttribute("data-status", s.status);

        var row = document.createElement("div");
        row.className = "mission-row";

        var btn = document.createElement("button");
        btn.className = "status-btn";
        btn.setAttribute("data-status", s.status);
        btn.setAttribute("aria-label", "Alternar status de " + item.titulo);
        btn.innerHTML = statusIcon(s.status);
        btn.addEventListener("click", function () {
          s.status = cycleStatus(s.status);
          saveState(state);
          renderAll();
        });

        var main = document.createElement("div");
        main.className = "mission-main";
        main.innerHTML =
          '<div class="mission-title"><span class="label">' + item.titulo + '</span>' +
          '<span class="priority-dot ' + item.prioridade + '">' + item.prioridade + '</span></div>' +
          '<div class="pasta-tag">' + item.pasta + '</div>';

        var select = document.createElement("select");
        select.className = "status-select";
        STATUS_CYCLE.forEach(function (opt) {
          var o = document.createElement("option");
          o.value = opt; o.textContent = opt;
          if (opt === s.status) o.selected = true;
          select.appendChild(o);
        });
        select.addEventListener("change", function () {
          s.status = select.value;
          saveState(state);
          renderAll();
        });

        var noteToggle = document.createElement("button");
        noteToggle.className = "note-toggle" + (s.nota ? " has-note" : "");
        noteToggle.setAttribute("aria-label", "Observação para " + item.titulo);
        noteToggle.innerHTML = iconNote;

        row.appendChild(btn);
        row.appendChild(main);
        row.appendChild(select);
        row.appendChild(noteToggle);

        var noteArea = document.createElement("div");
        noteArea.className = "note-area";
        var textarea = document.createElement("textarea");
        textarea.placeholder = "Anotações, dúvidas, próximos passos…";
        textarea.value = s.nota || "";
        textarea.addEventListener("input", function () {
          s.nota = textarea.value;
          saveState(state);
          if (textarea.value) noteToggle.classList.add("has-note");
          else noteToggle.classList.remove("has-note");
        });
        noteArea.appendChild(textarea);

        noteToggle.addEventListener("click", function () {
          noteArea.classList.toggle("open");
          if (noteArea.classList.contains("open")) textarea.focus();
        });

        mission.appendChild(row);
        mission.appendChild(noteArea);
        list.appendChild(mission);
      });

      group.appendChild(list);
      container.appendChild(group);
    });

    if (!anyVisible) {
      container.innerHTML = '<div class="empty-state">Nenhuma missão encontrada com esses filtros.</div>';
    }
  }

  function renderFilters() {
    var statusEl = document.getElementById("status-filters");
    var statusOptions = ["Todas", "Pendente", "Em andamento", "Concluído"];
    statusEl.innerHTML = "";
    statusOptions.forEach(function (opt) {
      var chip = document.createElement("button");
      chip.className = "chip" + (filters.status === opt ? " active" : "");
      chip.textContent = opt;
      chip.addEventListener("click", function () {
        filters.status = opt;
        renderAll();
      });
      statusEl.appendChild(chip);
    });

    var prioEl = document.getElementById("priority-filters");
    var prioOptions = ["Todas", "Alta", "Média"];
    prioEl.innerHTML = "";
    prioOptions.forEach(function (opt) {
      var chip = document.createElement("button");
      chip.className = "chip" + (filters.prioridade === opt ? " active" : "");
      chip.textContent = opt === "Todas" ? "Prioridade: Todas" : opt;
      chip.addEventListener("click", function () {
        filters.prioridade = opt;
        renderAll();
      });
      prioEl.appendChild(chip);
    });
  }

  function renderAll() {
    renderOverview();
    renderStageCards();
    renderFilters();
    renderMissions();
  }

  document.getElementById("search-input").addEventListener("input", function (e) {
    filters.search = e.target.value;
    renderMissions();
  });

  renderAll();
})();
