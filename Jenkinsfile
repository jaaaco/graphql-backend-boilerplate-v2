pipeline {
  agent any
  stages {
    stage('build') {
      parallel {
        stage('build') {
          steps {
            sh '''yarn install
./node_modules/.bin/webpack'''
          }
        }

        stage('test') {
          steps {
            sh '''yarn install
yarn code-style-test'''
          }
        }

      }
    }

  }
}