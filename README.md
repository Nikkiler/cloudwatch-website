# CloudWatch Alarm Dashboard

A single-pane dashboard for Amazon CloudWatch alarms across **multiple AWS accounts**. It reads every profile in your local AWS credentials file, pulls their alarms, and displays them as a color-coded grid — with an admin page to hide the alarms you don't care about.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-required-336791)

## Features

- **Multi-account** — automatically discovers every named profile in `~/.aws/credentials` and fetches alarms from each in parallel
- **At-a-glance status** — cards are color-coded by alarm state: `OK`, `ALARM`, `INSUFFICIENT_DATA`
- **Hide the noise** — an admin page with per-alarm visibility toggles; hidden alarms disappear from the main dashboard
- **Persistent settings** — visibility preferences are stored in Postgres and survive restarts
- **Auto-sync** — new alarms that appear in CloudWatch are added to the database automatically (visible by default)
- **Full pagination** — handles accounts with more alarms than a single `DescribeAlarms` page returns

## How it works

```
~/.aws/credentials ──► fetchAlarms ──► CloudWatch DescribeAlarms (per profile)
                                              │
                                              ▼
                          Postgres `alarms` table ◄── sync new alarm names
                                              │
                      ┌───────────────────────┴────────────────────┐
                      ▼                                            ▼
              /  (dashboard)                          /settingsPage (admin)
       shows alarms where visible = true        toggle visibility → POST /api/alarms/save
```

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io)
- A PostgreSQL database
- AWS credentials configured in `~/.aws/credentials` with at least one profile that has `cloudwatch:DescribeAlarms` permission

## Installation

```bash
git clone https://github.com/Nikkiler/cloudwatch-website.git
cd cloudwatch-website
pnpm install
```

### 1. Create the database table

Run the schema against your Postgres database (same values you put in `.env.local` below):

```bash
psql -h localhost -U postgres -d cloudwatch -f app/sql/schema.sql
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```ini
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=cloudwatch
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword

# Optional — defaults to ap-southeast-2
AWS_REGION=us-east-1
```

### 3. Run it

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

| Route | What it does |
|-------|--------------|
| `/` | Main dashboard. Shows all alarms that haven't been hidden. |
| `/settingsPage` | Admin view. Every alarm is listed with a toggle switch; flip the ones you want to hide and click **Save**. |
| `POST /api/alarms/save` | API endpoint the admin page calls. Accepts `[{ name, display_status }]` and upserts each row. |

### AWS profile setup

The app reads **every** profile in `~/.aws/credentials`:

```ini
[production]
aws_access_key_id = ...
aws_secret_access_key = ...

[staging]
aws_access_key_id = ...
aws_secret_access_key = ...
```

Both accounts' alarms appear on the same dashboard. A profile that fails to authenticate is logged and skipped — it won't bring down the page.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_HOST` | — | Database host |
| `POSTGRES_PORT` | — | Database port |
| `POSTGRES_DATABASE` | — | Database name |
| `POSTGRES_USER` | — | Database user |
| `POSTGRES_PASSWORD` | — | Database password |
| `AWS_REGION` | `ap-southeast-2` | Region to query for alarms (applies to all profiles) |

## Project structure

```
app/
├── page.tsx                  # Main dashboard (server component)
├── settingsPage/             # Admin visibility page
├── api/alarms/save/route.ts  # Upsert endpoint for visibility settings
├── components/               # AlarmCard, grids, buttons
├── lib/fetchAlarms.tsx       # AWS profile discovery + CloudWatch fetching + DB sync
└── sql/
    ├── db.tsx                # Postgres client
    └── schema.sql            # Table definition
scripts/seed.ts               # One-off script to seed the alarms table
```

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · PostgreSQL via [`postgres`](https://github.com/porsager/postgres) · AWS SDK v3


## Credits

The app itself was designed and written by hand. After it was finished, a small cleanup pass (four bug fixes and this README) was done with help from Claude, an AI assistant. Those commits are marked `Co-Authored-By: Claude` in the history.
