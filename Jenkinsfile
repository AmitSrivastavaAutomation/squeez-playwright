pipeline {
  agent { label 'windows' }                 // Your Windows Jenkins agent label

  tools { nodejs 'node18' }                 // NodeJS tool name in Jenkins (Manage Jenkins -> Tools)

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '25'))
  }

  environment {
    NODE_ENV = 'ci'
    PLAYWRIGHT_BROWSERS_PATH = '0'          // Browsers install in workspace
    CI = 'true'                             // Lets playwright.config.js detect CI mode
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare') {
      steps {
        bat 'git config --global core.longpaths true'
        bat 'node -v && npm -v'
      }
    }

    stage('Install dependencies & browsers') {
      steps {
        bat 'npm ci'
        bat 'npx playwright install'
      }
    }

    stage('Run Playwright tests') {
      steps {
        bat 'npm run test'
      }
    }

    stage('Publish reports') {
      steps {
        junit allowEmptyResults: true, testResults: 'test-results\\junit.xml'
        allure([results: [[path: 'allure-results']]])
        archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report\\**\\*'
      }
    }
  }

  post {
    success { echo '✅ Pipeline OK' }
    failure { echo '❌ Tests failed. Check JUnit + Allure tabs.' }
  }
}
