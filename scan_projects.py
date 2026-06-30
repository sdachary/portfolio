#!/usr/bin/env python3
"""
Portfolio Project Scanner
Scans /home/deepak/Work/ for projects and generates projects.json
"""

import json
import os
import subprocess
from pathlib import Path
from datetime import datetime

WORK_DIR = Path("/home/deepak/Work")
EXCLUDE_DIRS = {"node_modules", ".git", ".next", ".wrangler", "out", "dist", "portfolio", ".claude", ".mcp", "plans", "templates", "research", "roadmaps", "scripts", ".agents", "second-brain"}

# Manual overrides - explicit URLs and corrections (URLs won't be guessed)
OVERRIDE_FILE = Path(__file__).parent / "project_overrides.json"

def load_overrides():
    """Load manual URL overrides"""
    if OVERRIDE_FILE.exists():
        with open(OVERRIDE_FILE) as f:
            return json.load(f)
    return {}

def get_git_status(project_path):
    """Get git info: last commit date, if it has remote"""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cd", "--date=short"],
            cwd=project_path, capture_output=True, text=True
        )
        last_commit = result.stdout.strip() if result.returncode == 0 else None

        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=project_path, capture_output=True, text=True
        )
        remote = result.stdout.strip() if result.returncode == 0 else None

        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=project_path, capture_output=True, text=True
        )
        branch = result.stdout.strip() if result.returncode == 0 else None

        return {"last_commit": last_commit, "remote": remote, "branch": branch}
    except:
        return {"last_commit": None, "remote": None, "branch": None}


def read_file_safe(path):
    """Safely read a file"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except:
        return None


def parse_agents_md(content):
    """Parse AGENTS.md for project metadata"""
    info = {"status": "local", "priority": "medium", "type": ""}
    if not content:
        return info

    for line in content.split("\n"):
        line = line.strip()
        if line.startswith("status:"):
            val = line.split(":", 1)[1].strip().lower()
            if "progress" in val or "active" in val:
                info["status"] = "in-progress"
            elif "live" in val:
                info["status"] = "live"
            elif "shipped" in val or "done" in val:
                info["status"] = "shipped"
            elif "local" in val or "standalone" in val:
                info["status"] = "local"
        elif line.startswith("type:"):
            info["type"] = line.split(":", 1)[1].strip()
        elif line.startswith("priority:"):
            info["priority"] = line.split(":", 1)[1].strip().lower()

    return info


def parse_package_json(content):
    """Extract tech stack from package.json"""
    tags = []
    if not content:
        return tags
    try:
        data = json.loads(content)
        deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}

        if "next" in deps:
            tags.append("Next.js")
        if "react" in deps:
            tags.append("React")
        if "vite" in deps:
            tags.append("Vite")
        if "fastapi" in deps or "uvicorn" in deps:
            tags.append("FastAPI")
        if "express" in deps:
            tags.append("Express")
        if "hono" in deps:
            tags.append("Hono")
        if "tailwindcss" in deps:
            tags.append("Tailwind")
        if "typescript" in deps:
            tags.append("TypeScript")
        if "@cloudflare/next-on-pages" in deps or "wrangler" in deps:
            tags.append("Cloudflare Pages")
        if "@supabase/supabase-js" in deps:
            tags.append("Supabase")
    except:
        pass
    return tags


def parse_wrangler_toml(content):
    """Extract Cloudflare Pages URL from wrangler.toml - only from config, never guess"""
    if not content:
        return None
    for line in content.split("\n"):
        line = line.strip()
        if line.startswith("url") or "pages_dev" in line:
            if "https://" in line:
                url = line.split("=")[1].strip().strip('"\'')
                if "pages.dev" in url:
                    return url
    return None


def get_readme_description(content):
    """Extract project description from README: prefers bold tagline after title, then first real paragraph"""
    if not content:
        return ""
    lines = content.split("\n")

    in_code = False
    in_metadata = False
    found_h1 = False
    after_h1_lines = []
    bold_desc = None

    for line in lines:
        stripped = line.strip()

        # Track code blocks
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue

        # Track metadata block (YAML-style at top)
        if stripped.startswith(("project:", "type:", "status:", "priority:", "tags:")):
            in_metadata = True
            continue
        if in_metadata:
            if stripped and not stripped.startswith((">", "-", "*", "[", "|", "```")):
                in_metadata = False
            else:
                continue

        # Skip dividers and HTML comments
        if stripped.startswith(("---", "<!")):
            continue

        # Detect H1 title
        if stripped.startswith("# "):
            found_h1 = True
            continue

        if not found_h1:
            continue

        # Skip badge/shield/image lines
        if stripped.startswith("!") or "shield" in stripped.lower() or "badge" in stripped.lower():
            continue

        # Skip ASCII art
        if any(c in stripped for c in "╗╔╝╚║═║▌▐█"):
            continue

        # Skip table rows
        if stripped.startswith(("|", ":")):
            continue

        # Skip metadata-like lines (Status:, Language:, Location:)
        if any(stripped.startswith(f"**{kw}") for kw in ["Status", "Language", "Location", "Author", "License"]):
            continue

        # Capture bold description line (common pattern: **Desc** is the project tagline)
        if not bold_desc and stripped.startswith("**") and stripped.count("**") >= 2:
            bold_desc = stripped.replace("**", "")
            continue

        # Skip headings, blockquotes, lists, dividers
        if stripped.startswith(("#", ">", "-", "*", "_", "=", "1.", "2.", "3.", "4.", "5.", "```")):
            if after_h1_lines:
                break
            continue

        # Collect real paragraph lines (prefer sentence structures)
        if stripped:
            after_h1_lines.append(stripped)
            if len(after_h1_lines) >= 2:
                break

    # Prefer bold tagline, then first paragraph
    desc = bold_desc if bold_desc else " ".join(after_h1_lines[:2])
    desc = desc.replace("**", "").replace("*", "")
    return desc[:200].rstrip(". ") + ("..." if len(desc) > 200 else "") if desc else ""


def scan_projects():
    """Main scanner function"""
    projects = []
    overrides = load_overrides()

    for item in sorted(WORK_DIR.iterdir()):
        if not item.is_dir() or item.name.startswith(".") or item.name in EXCLUDE_DIRS:
            continue

        # Read project files
        agents_md = read_file_safe(item / "AGENTS.md")
        readme = read_file_safe(item / "README.md")
        package_json = read_file_safe(item / "package.json")
        wrangler_toml = read_file_safe(item / "wrangler.toml") or read_file_safe(item / "wrangler.jsonc")

        # Skip if no identifying files
        if not any([agents_md, readme, package_json]):
            continue

        # Extract metadata
        agents_info = parse_agents_md(agents_md)
        git_info = get_git_status(item)

        # Build project entry
        name = item.name.upper()
        status_map = {
            "live": "Live",
            "in-progress": "In Progress",
            "shipped": "Shipped",
            "local": "Local / Standalone"
        }
        status = status_map.get(agents_info["status"], "Local / Standalone")

        # Get description
        description = ""
        if readme:
            description = get_readme_description(readme)
        if not description and agents_md:
            description = get_readme_description(agents_md)

        # Get tags
        tags = []
        if package_json:
            tags = parse_package_json(package_json)
        if not tags:
            if "python" in str(item).lower() or (item / "requirements.txt").exists():
                tags.append("Python")
            if (item / "backend").exists() or (item / "agent").exists():
                tags.append("FastAPI")

        # Add status-based tags
        if agents_info["status"] == "live":
            tags.append("Live")
        elif agents_info["status"] == "in-progress":
            tags.append("In Progress")

        # Get live URL - ONLY from wrangler.toml or manual overrides, never guess
        live_url = None
        if wrangler_toml:
            live_url = parse_wrangler_toml(wrangler_toml)

        project = {
            "name": name,
            "slug": item.name,
            "status": status,
            "status_key": agents_info["status"],
            "description": description or f"{name} - part of the ecosystem.",
            "tags": list(dict.fromkeys(tags)),  # deduplicate
            "live_url": live_url,
            "local": agents_info["status"] == "local",
            "last_updated": git_info["last_commit"],
            "github_remote": git_info["remote"]
        }

        # Apply manual overrides (trumps everything)
        if item.name in overrides:
            override = overrides[item.name]
            if "live_url" in override:
                project["live_url"] = override["live_url"] or None
                # Update status badge if URL is set
                if override["live_url"] and project["status_key"] != "live":
                    project["status_key"] = "live"
                    project["status"] = "Live"
            if "github_url" in override:
                project["github_url"] = override["github_url"]
                if override.get("status") == "open-source":
                    project["status_key"] = "open-source"
                    project["status"] = "Open Source"
            if "status" in override:
                project["status_key"] = override["status"]
                project["status"] = status_map.get(override["status"], project["status"])
            if "description" in override:
                project["description"] = override["description"]
            if "tags" in override:
                project["tags"] = override["tags"]

        projects.append(project)

    return projects


def generate_html_projects(projects):
    """Generate HTML for project frames (to inject into index.html)"""
    html = []
    for i, p in enumerate(projects):
        status_class = f"status-{p['status_key']}"
        live_badge = "Live" if p["status_key"] == "live" else p["status"]

        html.append(f'      <div class="project-frame" data-index="{i}">')
        html.append(f'        <div>')
        html.append(f'          <div class="project-num">{str(i+1).zfill(2)}</div>')
        html.append(f'          <div class="project-status {status_class}">{live_badge}</div>')
        html.append(f'          <h3 class="project-name">{p["name"]}</h3>')
        html.append(f'          <p class="project-desc">{p["description"]}</p>')
        html.append(f'        </div>')
        html.append(f'        <div class="project-tags">')
        for tag in p["tags"][:5]:  # max 5 tags
            html.append(f'          <span class="tag">{tag}</span>')
        html.append(f'        </div>')
        if p["live_url"]:
            html.append(f'        <a href="{p["live_url"]}" target="_blank" class="project-link">Visit Live →</a>')
        html.append(f'      </div>')

    return "\n".join(html)


if __name__ == "__main__":
    projects = scan_projects()

    # Write JSON
    output_path = Path(__file__).parent / "public" / "projects.json"
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"✓ Generated {output_path} with {len(projects)} projects")

    # Write HTML snippet
    html_path = Path(__file__).parent / "projects_snippet.html"
    with open(html_path, "w") as f:
        f.write(generate_html_projects(projects))
    print(f"✓ Generated {html_path}")

    # Print summary
    print("\nProjects found:")
    for p in projects:
        print(f"  {p['name']:20} | {p['status']:15} | {p['live_url'] or 'local'}")
