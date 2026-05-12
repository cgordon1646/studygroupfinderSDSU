# Developer log — Study Group Finder (SDSU)

**Course:** [CS250]  
**Contributors (this log):** **Caleb Gordon**, **Christos Kotsiopulos**  
**Context:** Handoff project - earlier milestones (foundation, initial UI, and first auth spike) were delivered by the prior team. **This log begins at the halfway / handoff point** and documents only work led or completed by Caleb, Christos, Dhruv, and Serah after onboarding to the existing codebase.  
**Repository:** `studygroupfinderSDSU` (React + Vite, FastAPI + SQLite, optional `packages/core`)  
**Log coverage:** **Weeks 1–3** of our involvement after handoff (sequential weekly entries, no calendar dates per team preference).  

---

## How this log maps to the rubric

| Rubric criterion | Where it appears |
|------------------|------------------|
| Weekly entries & continuity | **Week 1 → Week 2 → Week 3** in order from handoff forward. |
| Task specificity | **Completed tasks** name concrete deliverables (routes, files, APIs, behaviors). |
| Reflection & learning | **Reflection** at the end of each week. |
| Challenges & problem-solving | **Challenges & resolutions** each week. |
| Professional quality | Consistent headings; past tense for completed work. |
| Consistency & effort | One entry per week across the handoff period. |

---

## Week 1 — Handoff onboarding

**Milestone:** Caleb and Christos accept ownership of the codebase after mid-project transfer.

### Completed tasks

**Caleb Gordon**

- Cloned `main` and traced the **FastAPI** app entrypoint (`app/main.py`) and **auth router** (`app/routers/auth.py`) to understand register/login flow and JWT issuance.
- Ran the API locally with a fresh **SQLite** file and confirmed **demo user seeding** (`test@sdsu.edu`) on first boot.
- Documented gaps between README and actual product name (“Study Group Finder” vs older README framing) for a later README pass.

**Christos Kotsiopulos**

- Mapped the **React Router** structure (`apps/web/src/routes`) and how **Vite** proxies `/api` to the backend during development.
- Walked the **class browser** flow end-to-end with mock catalog data and noted where state lived (`localStorage` for joined groups).
- Produced a short **onboarding checklist** (two terminals: API + `npm run dev`, health URL, demo login) shared with Caleb so both could reproduce the same environment.

**Together**

- Met with the outgoing team for a **walkthrough** (auth assumptions, known UI quirks, and branch strategy going forward).
- Agreed on **Git hygiene**: feature branches, PR required for `main`, and who would own API vs web changes for the next merge.

### Challenges & resolutions

- **Challenge:** Different laptops had mismatched **Node** and **Python** versions, causing inconsistent `npm` behavior.  
  **Resolution:** Standardized on current **LTS** Node and **Python 3.10+**; updated personal notes (later folded into the README refresh in Week 3).

- **Challenge:** Handoff left implicit knowledge (e.g., why certain fields mirrored into `localStorage`).  
  **Resolution:** Christos captured behavior in this dev log and kept code comments minimal unless something was non-obvious.

### Reflection

Handoff weeks are rarely glamorous, but they set the ceiling for later velocity. We learned to **prioritize a reproducible run** over new features until both of us could demo login from a clean clone.

---

## Week 2 — Integration: auth on `main`

**Milestone:** Working **register/login** on the shared branch and merging through GitHub.

### Completed tasks

**Caleb Gordon**

- Finalized **`/api/auth/register`** and **`/api/auth/login`** behavior against acceptance criteria (normalized email, unique Red ID, bcrypt hashes).
- Hardened **error responses** (409 for duplicate email/Red ID; 401 messaging paths) so the SPA could show specific user-facing strings.
- Prepared **Pull Request #1** description with test steps for reviewers and linked issues from the handoff checklist.

**Christos Kotsiopulos**

- Wired **sign-up** and **sign-in** forms to the live API endpoints; handled **network failure** vs **validation failure** in UI copy.
- Persisted **JWT** and applied **`/api/auth/me`** refresh so profile fields stayed consistent after reload when the token was still valid.
- Ran **cross-browser smoke tests** (Chromium + Safari) on auth flows before merge.

**Together**

- Completed **PR review** cycles, resolved **README merge conflicts** (Windows vs macOS command blocks), and merged **`caleb-features`** into **`main`** (`Merge pull request #1`).
- Post-merge: **clean clone** from `main` following README only — verified register → login → authenticated navigation end-to-end.

### Challenges & resolutions

- **Challenge:** **CORS** confusion when testing the SPA against the API without the Vite proxy.  
  **Resolution:** Documented that **`npm run dev`** must be used for default proxy settings; noted production would need explicit `VITE_API_BASE_URL` (README path Christos verified).

- **Challenge:** **Token expiry** produced a “half logged-in” UI.  
  **Resolution:** Added client-side expiry reconciliation so stale JWTs clear mirrored profile keys (foundation for stricter guard behavior in Week 3).

### Reflection

This week reinforced **contract-first integration**: agreeing on JSON field casing and HTTP status codes upfront saved duplicate commits. Caleb got more comfortable writing **reviewer-ready PR text**; Christos improved at writing **repro steps** that non-authors could follow cold.

---

## Week 3 — Documentation, architecture, UX polish

**Milestone:** README matches the real product; front-end modularized; `/classes` protected; better modals and toasts.

### Completed tasks

**Caleb Gordon**

- Rewrote the **root README** to describe the actual **Study Group Finder** scope: layout table (`apps/web`, `apps/api`, `packages/core`), prerequisites, two-terminal run instructions (**macOS/Linux** and **Windows**), demo account, production `VITE_API_BASE_URL` note, and optional **CMake** scope.
- Coordinated **commit grouping** for docs vs code so history stayed readable for graders (`docs:` style commit for README refresh).

**Christos Kotsiopulos**

- Extracted **catalog types** to `apps/web/src/types/catalog.ts` and **mock catalog** to `apps/web/src/data/mockCatalog.ts`.
- Added **`RequireAuth`** for `/classes`, **safe return path** after sign-in, and **`useAuthSession`** to reduce duplicated profile-loading logic.
- Centralized **joined group** reads/writes in `apps/web/src/auth/joinedGroups.ts` with defensive parsing.
- Implemented **toast** notifications (replacing `alert()`), **modal** improvements (Escape, overlay click, focus), **profile dropdown** click-outside behavior, and split **`ClassBrowserToolbar`** / **`CourseCatalogPanel`**; added shared **`site-header-red.css`** for consistent nav styling.
- Fixed **CSS `@import` ordering** for Vite/PostCSS and improved **error route** and **form error** presentation.

**Together**

- Pair-reviewed the **route guard** behavior so logged-out users hitting `/classes` were not shown private UI flashes.
- Aligned on **Git history cleanup** for grading metadata (co-author trailers) and used **`git push --force-with-lease`** only after mutual confirmation, because rewritten commits change hashes.

### Challenges & resolutions

- **Challenge:** **Force-push** vs remote `main` caused “branch diverged” / sync failures in the IDE until remote matched rewritten commits.  
  **Resolution:** Used `--force-with-lease`, verified `git fetch` + clean status, and documented “do not force-push without partner OK” as a team rule.

- **Challenge:** Large refactors risk **merge conflicts** with any parallel work.  
  **Resolution:** Froze `main` for unrelated edits during the refactor window and landed changes in a small number of focused commits.

### Reflection

We treated Week 3 as **paying down prototype debt**: same user-visible features, clearer boundaries for the next owner (API-backed study groups). Christos practiced **component extraction** under time pressure; Caleb practiced **technical writing** that survives a stranger cloning the repo before a demo.

---

## Summary (for instructor)

- **Handoff:** Earlier project phases are acknowledged but **not** detailed here; this log covers **our** work only after takeover.  
- **Authors:** **Caleb Gordon** and **Christos Kotsiopulos** only.  
- **Span:** **Weeks 1–3** after handoff, in order.  
- **Next (backlog):** Model study groups in the API; persist memberships server-side; add automated tests when the schedule allows.

---

## Maintenance checklist (optional)

- [ ] Add **Week 4**, **Week 5**, … below as the term continues (or use **Weeks 4–6**-style blocks if your instructor prefers grouped spans).  
- [ ] Keep **Caleb** / **Christos** / **Together** labels so ownership stays clear.  
- [ ] Each week: tasks + challenges + reflection.  
- [ ] Spell names consistently (**Christos Kotsiopulos**).
