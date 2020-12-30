pipeline {
  agent any
  stages {
    stages {
        stage('Test') { 
            steps {
                sh '''yarn install
yarn code-style-test'''
            }
        }
        stage('Build') {
            steps {
                sh '''yarn install
./node_modules/.bin/webpack'''
            }
        }
        
    }
  }
}
