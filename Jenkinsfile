pipeline {
  agent any
  stages {
    stage('Setup Requirements') {
      steps {
        sh ''' 
            #!/bin/bash
            bash setup.sh
            '''
      }
    }
    stage('Build') {
      steps {
        sh ''' 
            #!/bin/bash
            bash build.sh
            '''
      }
    }
    stage('Setup Database') {
      steps {
        sh ''' 
            #!/bin/bash
            bash test_setup.sh
            '''
      }
    }
    stage('Test') {
      steps {
        sh ''' 
            #!/bin/bash
            bash test.sh
            '''
      }
      post {
            always {
                junit 'rspec.xml'
            }
        }   
    }
    stage('Deploy') {
      steps {
        script {
          step([$class: "RundeckNotifier",
          rundeckInstance: "rdeck",
          jobId: "184e1419-091c-4728-a781-88da8438a91a"])
        }
      }
    }
  }
}