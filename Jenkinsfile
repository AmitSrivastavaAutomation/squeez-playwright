pipeline {
  agent any

  tools {
    nodejs 'NodeJS_16'
  }

  options {
    timestamps()
  }

  environment {
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
    RECIPIENTS = 'amit.qa11@gmail.com, believeinsuccess.amit@gmail.com'
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
          REM Ensure Allure reporter is available
          npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
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

    stage('Build single-file Allure HTML') {
      steps {
        bat '''
          if exist allure-single rd /s /q allure-single
          npx allure-commandline@latest generate allure-results --clean --single-file -o allure-single
          dir allure-single
        '''
        archiveArtifacts artifacts: 'allure-single/*.html', onlyIfSuccessful: false, allowEmptyArchive: true
      }
    }
  }

  post {
    success {
      emailext(
        to: env.RECIPIENTS,
        subject: "✅ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – SUCCESS",
        mimeType: 'text/html',
        attachmentsPattern: 'allure-single/*.html',
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – SUCCESS</p>
          <p>The Allure report is attached as <code>index.html</code>. Download and open it directly.</p>
        """
      )
    }
    failure {
      emailext(
        to: env.RECIPIENTS,
        subject: "❌ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – FAILED",
        mimeType: 'text/html',
        attachmentsPattern: 'allure-single/*.html',
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – FAILED</p>
          <p>The (partial) Allure report is attached as <code>index.html</code>.</p>
        """
      )
    }
  }
}
