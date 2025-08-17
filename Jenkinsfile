pipeline {
  agent any

  tools {
    // Manage Jenkins → Global Tool Configuration → NodeJS installations
    // Use the exact tool name you already have:
    nodejs 'NodeJS_16'
  }

  options {
    timestamps()
  }

  environment {
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
    RECIPIENTS = "amit.qa11@gmail.com, believeinsuccess.amit@gmail.com"
    // We'll fill this at runtime after generating the HTML:
    ATTACH_REPORT = ""
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

          REM Ensure Allure reporter is present
          npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
        '''
      }
    }

    stage('Run tests (Playwright + Allure)') {
      steps {
        REM If your playwright.config already enables allure reporter, you can drop the --reporter flag
        bat 'npx playwright test --reporter=line,allure-playwright'
      }
      post {
        always {
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
        }
      }
    }
  }

  post {
    /**
     * ALWAYS try to build a single-file Allure HTML and set the attachment path.
     * This runs even if tests failed.
     */
    always {
      script {
        try {
          bat '''
            if exist allure-single rd /s /q allure-single
            npx allure-commandline@latest generate allure-results --clean --single-file -o allure-single
          '''
        } catch (ignored) {
          echo "Allure single-file generation failed (maybe no results). Continuing…"
        }
        if (fileExists('allure-single/index.html')) {
          env.ATTACH_REPORT = 'allure-single/index.html'
          archiveArtifacts artifacts: env.ATTACH_REPORT, onlyIfSuccessful: false, allowEmptyArchive: false
        } else {
          echo "No single-file Allure HTML found to attach."
        }
      }
    }

    success {
      emailext(
        to: env.RECIPIENTS,
        subject: "✅ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – SUCCESS",
        mimeType: 'text/html',
        // attach only if it exists
        attachmentsPattern: env.ATTACH_REPORT,
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
        attachmentsPattern: env.ATTACH_REPORT,
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – FAILED</p>
          <p>The (partial) Allure report is attached as <code>index.html</code> if available.</p>
        """
      )
    }
  }
}
