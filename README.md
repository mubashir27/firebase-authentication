# Project Name

Brief description of your project.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

## Introduction

Provide a brief introduction to your project. Explain what it does, its purpose, and why it's valuable. Include any high-level concepts and goals.

## Features

List the key features of your project.

- Authentication flows with firebase using firestore Node JS Typescript.
- verify otp while creating an account
- refresh token for protected routes

## Prerequisites

- for firebase configuration in your project and add serviceAccount.json in root

### ServiceAccount.json format

```bash
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----",
  "client_email": "your-service-account-email@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project-id.iam.gserviceaccount.com"
  }
```

- create .env file in root and make sure to add these variable

### ENV file format

```bash
NODE_ENV=local
JWT_SECRET = jwt-secret
MAIL_ID = your.mail@example.com
MAIL_PASSWORD = password-created-from-google-app-password
```

## Installation

```bash
# Clone the repository
git clone https://github.com/mubashir27/firebase-authentication-nodeJS.git

# Change directory
cd firebase-authentication-nodeJS

# Install dependencies
npm install

# Start project
npm run start:dev
```
