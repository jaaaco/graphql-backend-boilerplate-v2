pipeline {
  agent any
  stages {
    stage('Test') { 
          steps {
              sh '''curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts'''
              sh '''yarn install
yarn code-style-test'''
          }
      }
      stage('Build') {
          steps {
              sh '''curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts'''
              sh '''yarn install
./node_modules/.bin/webpack'''
          }
      }
  }
}
