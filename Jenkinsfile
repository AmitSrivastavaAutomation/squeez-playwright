  post {
    always {
      script {
        try {
          bat '''
            if exist allure-single rd /s /q allure-single
            npx allure-commandline@latest generate allure-results --clean --single-file -o allure-single
          '''
        } catch (Exception e) {
          echo "⚠️ Failed to generate Allure HTML report: ${e}"
        }
      }
      archiveArtifacts artifacts: 'allure-single/*.html', onlyIfSuccessful: false, allowEmptyArchive: true
    }

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
