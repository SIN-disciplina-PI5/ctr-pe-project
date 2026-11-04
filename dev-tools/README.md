# dev-tools

Development tools for Manutencao Conectada.

## Structure

dev-tools/
├── docker-compose.yml
├── .env                        (generated locally, not committed)
├── beef/
│   └── docker-compose.yml      isolated opt-in service
├── sonar/
│   ├── backend.properties
│   └── frontend.properties
├── scripts/
│   ├── sonar-setup.sh          first-time SonarQube setup
│   ├── sonar-scan.sh           run analysis
│   ├── beef-setup.sh           explicit local opt-in for BeEF
│   ├── beef-start.sh           start the opted-in local container
│   └── beef-verify.sh          prove no hook is present in the frontend
└── README.md

## SonarQube

### First time

```bash
bash dev-tools/scripts/sonar-setup.sh
```

This will:
1. Start the SonarQube container
2. Change the default admin password
3. Create the backend and frontend projects
4. Generate a token and save it to dev-tools/.env

### Run the scan

```bash
bash dev-tools/scripts/sonar-scan.sh
```

The scan:

1. starts SonarQube;
2. installs missing dependencies with `npm ci`;
3. generates real LCOV coverage for backend unit/AI tests and frontend tests;
4. stops immediately if coverage or either scan fails;
5. analyzes backend and frontend as separate SonarQube projects.

It works on any branch. No push to `main` is required.

- Backend: http://localhost:9000/dashboard?id=manutencao-conectada-backend
- Frontend: http://localhost:9000/dashboard?id=manutencao-conectada-frontend

The backend coverage command loads `backend/.env` when it exists. Keep real database credentials only in that ignored local file. The frontend requires no development token or simulated profile.

### Stop

```bash
cd dev-tools
docker compose down
```

## Notes

- The default SonarQube login is `admin` / `admin` before setup.
- Coverage directories are generated artifacts and must remain ignored by Git.

## BeEF (local and opt-in only)

Use this container only on application instances and pages you own or are explicitly authorized to test. It is not
part of the frontend, backend, normal Docker startup or production deployment.

First-time local opt-in:

```bash
bash dev-tools/scripts/beef-setup.sh
```

The script asks for a local password, stores it in the ignored `dev-tools/.env`, verifies that no hook exists in the
frontend and starts only the `beef-local` Docker profile. The panel and hook bind exclusively to `127.0.0.1`:

- panel: http://127.0.0.1:3000/ui/panel (user `beef`);
- hook: http://127.0.0.1:6789/hook.js, to be inserted manually only in an authorized local test page.

Start again after setup:

```bash
bash dev-tools/scripts/beef-start.sh
```

Confirm that source files and any existing normal web bundle contain no BeEF marker:

```bash
bash dev-tools/scripts/beef-verify.sh
```

Stop and remove only the local test container:

```bash
cd dev-tools
docker compose --env-file .env -f beef/docker-compose.yml --profile beef-local rm -sf beef
```
