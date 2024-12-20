# Namespace SelfService

This is a self-service portal for creating namespaces in a deployKf deployment by adding users to a value.yaml file and committing the changes to a git repository.

Important: This application has no authentication, so it should be used behind an authentication proxy and the proxy should append the user's email in the `kubeflow-userid` variable to the header.

The default base path of the application is `/selfservice/` and can only be changed by rebuilding the image and passing a different `BASE_PATH` value.

## Prerequisites

-   Node.js

## Install and Run

Install required node modules

```bash
npm install
```

Run Server with Hot-Reload (Development)

```bash
npm run dev
```

## Environment Variables

| Variable             | Description                          |
| :------------------- | :----------------------------------- |
| `GITHUB_REPO_OWNER`  | The owner of the repository          |
| `GITHUB_REPO_NAME`   | The name of the repository           |
| `GITHUB_REPO_BRANCH` | The branch where the file is located |
| `GITHUB_FILE_PATH`   | The path to the yaml file            |
| `GITHUB_TOKEN`       | GitHub personal access token         |
