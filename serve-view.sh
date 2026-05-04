#!/usr/bin/env bash
set -euo pipefail

BLOG_SECTIONS="books music study travel"
PORTFOLIO_SECTIONS="multimedia recordings software tech-management timeline"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

usage() {
    echo "Usage: $0 <creative|blog|portfolio>"
    echo ""
    echo "Serves a filtered view of the site locally."
    echo "  creative  - all content (port 1111)"
    echo "  blog      - books, music, study, travel (port 1112)"
    echo "  portfolio - multimedia, recordings, software, tech-management, timeline (port 1113)"
    exit 1
}

[ $# -lt 1 ] && usage

VIEW="$1"

case "$VIEW" in
    creative)
        echo "==> Serving creative (all content) on http://127.0.0.1:1111"
        exec zola serve --port 1111
        ;;
    blog)
        PORT=1112
        SECTIONS="$BLOG_SECTIONS"
        TITLE="Blog"
        ;;
    portfolio)
        PORT=1113
        SECTIONS="$PORTFOLIO_SECTIONS"
        TITLE="Portfolio"
        ;;
    *)
        usage
        ;;
esac

echo "==> Preparing $VIEW view..."

TMP="$PROJECT_DIR/.serve-$VIEW"
rm -rf "$TMP"
mkdir -p "$TMP/content"

for section in $SECTIONS; do
    [ -d "$PROJECT_DIR/content/$section" ] && cp -r "$PROJECT_DIR/content/$section" "$TMP/content/"
done

cat > "$TMP/content/_index.md" <<EOF
+++
title = "$TITLE"
sort_by = "date"
page_template = "article.html"
+++
EOF

ln -sf "$PROJECT_DIR/themes" "$TMP/themes"
ln -sf "$PROJECT_DIR/templates" "$TMP/templates"
ln -sf "$PROJECT_DIR/static" "$TMP/static"
ln -sf "$PROJECT_DIR/sass" "$TMP/sass" 2>/dev/null || true
cp "$PROJECT_DIR/config.${VIEW}.toml" "$TMP/config.toml"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

echo "==> Serving $VIEW on http://127.0.0.1:$PORT"
cd "$TMP" && exec zola serve --port "$PORT"
