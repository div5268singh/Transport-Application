<<<<<<< HEAD
# New Satna Road Lines
=======
# SantaRoad
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.35.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

<<<<<<< HEAD
## Production deployment

Install the .NET 8 Hosting Bundle on the server, then create the combined Angular and API artifact from the repository root:

```powershell
dotnet publish .\server\SantaRoad.Api\SantaRoad.Api.csproj -c Release -o .\artifacts\publish
```

Deploy the contents of `artifacts/publish`. The API serves the Angular application, so a separate frontend server is not required.

Configure these environment variables in IIS, the service manager, or the container platform. Do not put production secrets in `appsettings.json`:

```text
ASPNETCORE_ENVIRONMENT=Production
Database__Firestore__ProjectId=<Firebase project ID>
GOOGLE_APPLICATION_CREDENTIALS=<absolute path to service-account JSON>
Jwt__Key=<long random signing key of at least 32 characters>
AdminSeed__Password=<initial admin password>
```

Create the service account in Firebase Console under **Project settings > Service accounts**, download its JSON key, and store it outside the repository. In Google Cloud hosting, prefer Application Default Credentials or workload identity and omit `GOOGLE_APPLICATION_CREDENTIALS`.

To use a relational database later, supply its connection string:

```text
ConnectionStrings__SqlServer=<SQL Server connection string>

ConnectionStrings__MySql=<MySQL connection string>
```

The API automatically uses the first configured database in this order: SQL Server, MySQL, then Firestore. Empty connection strings and an empty or placeholder Firebase project ID are skipped. If none is configured, startup stops with a configuration error. A configured database that is temporarily unreachable does not trigger fallback, preventing accidental writes to a different database.

SQL Server uses the existing EF Core migrations. Before deploying with MySQL, generate and test a MySQL-specific migration set because the current migrations were created for SQL Server.

For a separately hosted frontend, also configure `Cors__AllowedOrigins__0` with its exact HTTPS origin. Same-origin deployments do not need a CORS origin.

For relational providers, the application applies pending EF Core migrations during startup. Every provider seeds missing content/admin data. A SQL identity must therefore have schema migration permissions; restrict those permissions after startup if migrations are handled separately.

Terminate HTTPS at IIS or another trusted reverse proxy and forward the original protocol. ASP.NET Core honors `X-Forwarded-Proto`, enables HSTS in Production, and redirects plain HTTP to HTTPS. Use `/health` for readiness monitoring.

Persist and back up `wwwroot/uploads` across releases. It contains administrator-uploaded media and must not be replaced when deploying a new artifact.

Rotate any database password, JWT key, or admin password that has previously been shared or committed. Keep `server/SantaRoad.Api/appsettings.Development.json` local; it is ignored and excluded from publish output.

=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
