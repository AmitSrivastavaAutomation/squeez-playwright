pipeline {
  agent any

  tools {
    nodejs 'NodeJS_16'   // Match your tool name in Manage Jenkins → Global Tool Configuration
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

          REM Ensure Allure reporter and CLI are present locally
          npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright
          npm ls allure-commandline >NUL 2>&1 || npm i -D allure-commandline@latest
        '''
      }
    }

    stage('Run tests (do not abort pipeline on failure)') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          bat 'npx playwright test --reporter=line,allure-playwright'
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
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
            echo 'Allure single-file generation failed (maybe no results). Continuing…'
          }
        }
      }
    }

    stage('Send email (attach HTML if available)') {
      steps {
        script {
          def hasReport = fileExists('allure-single/index.html')
          def subjectPrefix = (currentBuild.currentResult == 'SUCCESS') ? '✅' : '❌'
          def subject = "${subjectPrefix} Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – ${currentBuild.currentResult}"

          if (hasReport) {
            archiveArtifacts artifacts: 'allure-single/index.html', onlyIfSuccessful: false
            emailext(
              to: env.RECIPIENTS,
              subject: subject,
              mimeType: 'text/html',
              attachmentsPattern: 'allure-single/index.html',
              body: """
                <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – ${currentBuild.currentResult}</p>
                <p>The Allure report is attached as <code>index.html</code>. Download and open it directly.</p>
              """
            )
          } else {
            emailext(
              to: env.RECIPIENTS,
              subject: subject,
              mimeType: 'text/html',
              body: """
                <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – ${currentBuild.currentResult}</p>
                <p>No Allure HTML attachment was produced (no allure-results). Check console log.</p>
              """
            )
          }
        }
      }
    }
  }
}
