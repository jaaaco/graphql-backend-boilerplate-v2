pipeline {
  agent ecs
  stages {
    stage('Test') { 
          steps {
              sh '''sudo mkdir -p /usr/local/n && chown -R $(whoami) /usr/local/n/
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts'''
              sh '''yarn install
yarn code-style-test'''
          }
      }
      stage('Build') {
          steps {
              sh '''sudo mkdir -p /usr/local/n && chown -R $(whoami) /usr/local/n/
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts'''
              sh '''yarn install
./node_modules/.bin/webpack'''
          }
      }
  }
}
