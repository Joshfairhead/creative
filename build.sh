#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

build_view() {
  local name=$1; shift
  local config=$1; shift
  local sections=("$@")

  local build_dir="$ROOT/_build/$name"
  rm -rf "$build_dir"
  mkdir -p "$build_dir/content"

  # Symlink shared assets
  ln -s "$ROOT/themes" "$build_dir/themes"
  ln -s "$ROOT/templates" "$build_dir/templates"
  ln -s "$ROOT/sass" "$build_dir/sass"
  ln -s "$ROOT/static" "$build_dir/static"

  # Copy _index.md with view-specific title
  sed "s/^title = .*/title = \"$name\"/" "$ROOT/content/_index.md" > "$build_dir/content/_index.md"

  # Copy only relevant content sections
  for section in "${sections[@]}"; do
    cp -r "$ROOT/content/$section" "$build_dir/content/"
  done

  # Build
  zola --root "$build_dir" --config "$ROOT/$config" build --output-dir "$ROOT/public_$name"
  echo "==> Built $name view -> public_$name/"
}

# Creative view (all content, default config)
zola build
echo "==> Built creative view -> public/"

# Blog view
build_view Blog config.blog.toml books music study travel

# Portfolio view
build_view Portfolio config.portfolio.toml multimedia recordings software tech-management timeline

echo "Done. All three views built."
