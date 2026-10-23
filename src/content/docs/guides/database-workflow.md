---
title: Work with databases
description: Prepare a safe connection and inspect database information using supported r0 tools.
category: guides
order: 7
---

# Work with databases

r0 includes tools for connecting to and inspecting supported databases. Exact database engines, connection fields, and available operations depend on your r0 version. Check the current [project README](https://github.com/Adshkumar/r0#readme) and in-app guidance for the supported setup before connecting.

## Prepare a safe connection

1. Identify the database engine and version used by the project.
2. Find the connection details in the project's approved setup instructions or ask the project owner.
3. Prefer a local development database or a read-only account when you only need to inspect data.
4. Keep passwords and connection strings in a secure local secret store or environment configuration—not in source files, prompts, screenshots, or commits.
5. Use the connection method and fields documented by the installed r0 release.

Do not connect a development tool to production data unless you are explicitly authorized and understand the impact of each operation.

## Inspect data cautiously

Start by confirming the active connection and database before browsing tables or running queries. Use small, targeted reads to understand the schema and sample records. Avoid broad queries on large tables, and do not change or delete data unless the task requires it and you have a safe recovery plan.

If the connection fails, check the engine, host, port, network access, and credentials against the approved configuration. Do not paste a complete connection string into an issue or AI chat; remove secrets before sharing an error.

## Disconnect and protect credentials

Close or remove connections you no longer need, especially on shared machines. Never commit credentials or copy production data into project fixtures. Follow your team's retention, access, and data-handling policies.
