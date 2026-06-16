#!/bin/bash
set -euo pipefail

# Install / update everything-claude-code (ECC) at session start so all ECC
# agents, commands, skills, rules, and hooks are available in ~/.claude/.
#
# Only runs in Claude Code on the web. Local sessions are skipped so this
# does not surprise a developer's local install.

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ECC_REPO="https://github.com/affaan-m/everything-claude-code"
ECC_DIR="${HOME}/everything-claude-code"

ensure_clone() {
  if [ -d "${ECC_DIR}/.git" ]; then
    echo "[ECC] Updating existing clone at ${ECC_DIR}"
    git -C "${ECC_DIR}" fetch --quiet origin || return 1
    git -C "${ECC_DIR}" pull --ff-only --quiet || {
      echo "[ECC] Could not fast-forward; keeping current checkout"
    }
  else
    echo "[ECC] Cloning ${ECC_REPO} into ${ECC_DIR}"
    git clone --quiet "${ECC_REPO}" "${ECC_DIR}" || return 1
  fi
}

run_installer() {
  echo "[ECC] Running install.sh --profile full"
  (cd "${ECC_DIR}" && ./install.sh --profile full >/dev/null) || return 1
}

if ensure_clone && run_installer; then
  echo "[ECC] Session-start install complete"
else
  echo "[ECC] Session-start install hit an error; continuing without ECC update" >&2
fi
