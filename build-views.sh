#!/usr/bin/env bash
set -euo pipefail

# Content sections for each view
BLOG_SECTIONS="books music study travel"
PORTFOLIO_SECTIONS="multimedia recordings software tech-management timeline"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$PROJECT_DIR/dist"

build_view() {
    local view="$1"
    local config="$2"
    local sections="$3"
    local title="$4"

    echo "==> Building $view view..."

    local tmp_content="$PROJECT_DIR/.build-$view/content"
    rm -rf "$PROJECT_DIR/.build-$view"
    mkdir -p "$tmp_content"

    # Copy only the relevant sections
    for section in $sections; do
        if [ -d "$PROJECT_DIR/content/$section" ]; then
            cp -r "$PROJECT_DIR/content/$section" "$tmp_content/"
        fi
    done

    # Create _index.md with the view title
    cat > "$tmp_content/_index.md" <<EOF
+++
title = "$title"
sort_by = "date"
page_template = "article.html"
+++
EOF

    # Build with zola using a temporary content dir
    # Zola doesn't support --content-dir, so we symlink
    local tmp_project="$PROJECT_DIR/.build-$view"
    ln -sf "$PROJECT_DIR/themes" "$tmp_project/themes"
    ln -sf "$PROJECT_DIR/templates" "$tmp_project/templates"
    ln -sf "$PROJECT_DIR/static" "$tmp_project/static"
    ln -sf "$PROJECT_DIR/sass" "$tmp_project/sass" 2>/dev/null || true
    cp "$PROJECT_DIR/$config" "$tmp_project/config.toml"

    (cd "$tmp_project" && zola build -o "$BUILD_DIR/$view" 2>&1)

    rm -rf "$PROJECT_DIR/.build-$view"
    echo "    ✓ $view built -> dist/$view/"
}

# Clean
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Build creative (all content)
echo "==> Building creative view..."
zola build -o "$BUILD_DIR/creative" 2>&1
echo "    ✓ creative built -> dist/creative/"

# Build blog (subset)
build_view "blog" "config.blog.toml" "$BLOG_SECTIONS" "Blog"

# Build portfolio (subset)
build_view "portfolio" "config.portfolio.toml" "$PORTFOLIO_SECTIONS" "Portfolio"

echo ""
echo "All views built in dist/"
echo "  creative: $(find "$BUILD_DIR/creative" -name '*.html' | wc -l | tr -d ' ') pages"
echo "  blog:     $(find "$BUILD_DIR/blog" -name '*.html' | wc -l | tr -d ' ') pages"
echo "  portfolio: $(find "$BUILD_DIR/portfolio" -name '*.html' | wc -l | tr -d ' ') pages"
