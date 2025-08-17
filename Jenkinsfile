pipeline {
  agent any
  options { timestamps() }

  environment {
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
    RECIPIENTS = "amit.qa11@gmail.com, believeinsuccess.amit@gmail.com"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Test with Node 20') {
      steps {
        // This wrapper guarantees PATH is set to the NodeJS tool we specify
        nodejs(nodeJSInstallationName: 'NodeJS_20') {
          bat '''
            node -v
            npm -v

            REM Clean install project deps
            npm ci

            REM Install Playwright browsers
            npx playwright install

            REM Ensure reporters/CLI exist (no-op if already installed)
            npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
            npm ls allure-commandline >NUL 2>&1 || npm i -D allure-commandline@latest

            REM Run tests (reporters are in playwright.config.js)
            npx playwright test
          '''
        }
      }
      post {
        always {
          // Keep raw results and JUnit for Jenkins trends even on failure
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
          junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
        }
      }
    }

    stage('Build single-file Allure HTML') {
      steps {
        nodejs(nodeJSInstallationName: 'NodeJS_20') {
          script {
            try {
              bat '''
                if exist allure-single rd /s /q allure-single
                REM IMPORTANT: use allure-commandline, not "allure" v3
                npx allure-commandline generate allure-results -o allure-single --clean --single-file
                dir allure-single
              '''
            } catch (ignored) {
              echo 'Allure single-file generation failed (maybe no allure-results).'
            }
          }
        }
      }
    }

    stage('Email (attach HTML if available)') {
      steps {
        script {
          def hasReport = fileExists('allure-single/index.html')
          def status = currentBuild.currentResult
          def icon = (status == 'SUCCESS') ? '✅' : (status == 'UNSTABLE' ? '⚠️' : '❌')
          def subject = "${icon} Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – ${status}"

          if (hasReport) {
            archiveArtifacts artifacts: 'allure-single/index.html', onlyIfSuccessful: false
            emailext(
              to: env.RECIPIENTS,
              subject: subject,
              mimeType: 'text/html',
              attachmentsPattern: 'allure-single/index.html',
              body: """
                <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – ${status}</p>
                <p>The Allure report is attached as <code>index.html</code>. Download and open it directly.</p>
              """
            )
          } else {
            emailext(
              to: env.RECIPIENTS,
              subject: subject,
              mimeType: 'text/html',
              body: """
                <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – ${status}</p>
                <p>No Allure HTML attachment was produced. Check whether <code>allure-results/</code> exists in the workspace.</p>
              """
            )
          }
        }
      }
    }
  }
}
