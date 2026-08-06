# Deployment Status

Production deployment is not currently supported or validated. The backend
`Dockerfile` and `config/deploy.yml` are Rails-generated starting points, not a
production-ready topology. In particular, backups, TLS, secrets management,
observability, frontend hosting, database provisioning, and rollback procedures
must be designed and tested before deployment.

The backend image expects an external PostgreSQL service. The current production
Rails configuration defines primary, cache, queue, and cable databases; provision
all four or deliberately revise that topology before deploying. Do not use the
placeholder Kamal host or registry.

## Environment Matrix

| Variable | Development | Production template |
| --- | --- | --- |
| `DATABASE_URL` | Optional; Rails defaults to local `nutrium_development` | Primary PostgreSQL URL; validate interaction with the additional databases |
| `BACKEND_DATABASE_PASSWORD` | Not required with local peer access | Password used by the current primary/cache/queue/cable configuration |
| `FRONTEND_ORIGINS` | Defaults to `http://localhost:5173` | Required comma-separated HTTPS frontend origins |
| `RAILS_MASTER_KEY` | Usually not required | Required to decrypt Rails credentials |
| `RAILS_LOG_LEVEL` | Optional | Optional; defaults to `info` |
| `VITE_API_URL` | Defaults to `http://localhost:3000` | Frontend build-time API origin; omit for same-origin hosting |

The backend does not load `.env` files. Export variables in the process manager
or shell. Vite loads `frontend/.env*` at build time and only exposes `VITE_`
variables, so never put secrets in `VITE_API_URL` or any other `VITE_` value.
