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
      description: 'Select which suite to run'
    )
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

    stage('Run Cypress Suite') {
      steps {
        script {
          def runCommand = "npm run test:tag:${params.TEST_SUITE} -- --reporter junit --reporter-options mochaFile=results/junit/${params.TEST_SUITE}-${env.BUILD_NUMBER}-[hash].xml,toConsole=true"

          if (isUnix()) {
            sh 'mkdir -p results/junit'
            sh runCommand
          } else {
            bat """
              @echo off
              if not exist "results\\junit" mkdir "results\\junit"
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
