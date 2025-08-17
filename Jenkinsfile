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

          :: Playwright browsers
          npx playwright install

          :: Ensure Allure reporter is present
          call npm ls allure-playwright >NUL 2>&1 || npm i -D allure-playwright

          :: (Optional) pull latest Allure CLI on-demand via npx (no global install needed)
          npx allure-commandline --version
        '''
      }
    }

    stage('Run tests (Playwright + Allure)') {
      steps {
        :: // If reporter is already in playwright.config, you can drop --reporter flag
        bat 'npx playwright test --reporter=line,allure-playwright'
      }
      post {
        always {
          archiveArtifacts artifacts: 'allure-results/**', onlyIfSuccessful: false, allowEmptyArchive: true
        }
      }
    }

    stage('Build Allure single HTML') {
      steps {
        // Create a self-contained HTML so it works as an email attachment
        bat '''
          if exist allure-single rd /s /q allure-single
          npx allure generate allure-results --clean --single-file -o allure-single
          dir allure-single
        '''
        // Keep the single-file HTML as a build artifact (helpful for debugging)
        archiveArtifacts artifacts: 'allure-single/*.html', onlyIfSuccessful: false, allowEmptyArchive: true
      }
    }

    // (Optional) You can also publish the normal Allure report in Jenkins UI
    // stage('Publish Allure report in Jenkins') {
    //   steps {
    //     allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
    //   }
    // }
  }

  post {
    success {
      emailext(
        to: env.RECIPIENTS,
        subject: "✅ Allure: ${env.JOB_NAME} #${env.BUILD_NUMBER} – SUCCESS",
        mimeType: 'text/html',
        // Attach the single-file HTML report
        attachmentsPattern: 'allure-single/*.html',
        body: """
          <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a> – SUCCESS</p>
          <p>The Allure report is attached as an HTML file (open directly).</p>
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
          <p>The Allure report (may be partial) is attached as an HTML file.</p>
        """
      )
    }
  }
}
