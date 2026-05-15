pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    choice(
      name: 'TEST_SUITE',
      choices: ['smoke', 'regression'],
      description: 'Select which tagged suite to run'
    )
  }

  environment {
    REPORTS_DIR = 'results/junit'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Run Cypress by Tag') {
      steps {
        script {
          def tag = params.TEST_SUITE == 'smoke' ? '@smoke' : '@regression'
          def reportFile = "${env.REPORTS_DIR}/${params.TEST_SUITE}-${env.BUILD_NUMBER}-[hash].xml"
          def runCommand = "npx cypress run --env grepTags=${tag} --reporter junit --reporter-options mochaFile=${reportFile},toConsole=true"

          if (isUnix()) {
            sh "mkdir -p ${env.REPORTS_DIR}"
            sh "ELECTRON_RUN_AS_NODE= ${runCommand}"
          } else {
            bat """
              @echo off
              if not exist "${env.REPORTS_DIR}" mkdir "${env.REPORTS_DIR}"
              set ELECTRON_RUN_AS_NODE=
              ${runCommand}
            """
          }
        }
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'results/junit/*.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'results/junit/*.xml, cypress/screenshots/**, cypress/videos/**'
    }
  }
}
