pipeline {
  agent any

  tools {
    // Manage Jenkins → Global Tool Configuration → NodeJS installations
    nodejs 'NodeJS_16'
  }

  options { timestamps() }

  environment {
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
    RECIPIENTS = "amit.qa11@gmail.com, believeinsuccess.amit@gmail.com"
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

          REM Playwright browsers
          npx playwright install

          REM Ensure Allure reporter + CLI exist locally (safe no-ops if already installed)
          npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
          npm ls allure-commandline >NUL 2>&1 || npm i -D allure-commandline@latest
        '''
      }
    }

    stage('Run tests') {
      steps {
        /*
         * Reporters are defined in playwright.config.js:
         *   ["line"], ["junit", { outputFile: "test-results/junit.xml" }],
         *   ["allure-playwright", { outputFolder: "allure-results" }]
         */
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          bat 'npx playwright test'
        }
      }
      post {
        always {
          // Keep raw results for debugging & trend
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
          junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
        }
      }
    }

    stage('Build single-file Allure HTML') {
      steps {
        script {
          try {
            bat '''
              if exist allure-single rd /s /q allure-single
              npx allure generate allure-results --clean --single-file -o allure-single
              dir allure-single
            '''
          } catch (ignored) {
            echo 'Allure single-file generation failed (maybe no results).'
          }
        }
      }
    }

    stage('Send email (attach HTML if available)') {
      steps {
        script {
          def hasReport = fileExists('allure-single/index.html')
          def status = currentBuild.currentResult
          def subjectIcon = (status == 'SUCCESS') ? '✅' : (status == 'UNSTABLE' ? '⚠️' : '❌')
          def subject = "${subjectIcon} Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – ${status}"

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
                <p>No Allure HTML attachment was produced. Ensure <code>allure-results/</code> exists (check console log).</p>
              """
            )
          }
        }
      }
    }
  }
}
