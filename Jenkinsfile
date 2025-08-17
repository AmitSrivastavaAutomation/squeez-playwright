pipeline {
  agent any

  tools {
    nodejs 'NodeJS_16'   // Manage Jenkins → Global Tool Configuration → NodeJS installations
  }

  options {
    timestamps()
  }

  environment {
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
    RECIPIENTS = 'amit.qa11@gmail.com, ai@mobmaxime.com'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install deps') {
      steps {
        bat '''
          node -v
          npm -v
          npm ci
          npx playwright install
          call npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
        '''
      }
    }

    stage('Run tests (Playwright + Allure)') {
      steps {
        bat 'npx playwright test --reporter=line,allure-playwright'
      }
      post {
        always {
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
        }
      }
    }

    stage('Publish Allure report') {
      steps {
        // Requires Allure Jenkins plugin
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    success {
      emailext(
        to: env.RECIPIENTS,
        subject: "✅ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – SUCCESS",
        mimeType: 'text/html',
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – SUCCESS</p>
          <p><strong>Allure Report:</strong> <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p>
        """
      )
    }
    failure {
      emailext(
        to: env.RECIPIENTS,
        subject: "❌ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – FAILED",
        mimeType: 'text/html',
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – FAILED</p>
          <p><strong>Allure Report (may be partial):</strong> <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p>
        """
      )
    }
  }
}
