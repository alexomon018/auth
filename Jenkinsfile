pipeline {
    agent any 

    environment {
        
        registry = "mojdockerbre/auth:auth-backend-v1"
      
        registryCredential = 'auth-app-tokencina'
        dockerImage = ''
    }
    
    stages {
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/alexomon018/auth']]])       
            }
        }
    

    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry
        }
      }
    }
    
  
    stage('Upload Image') {
     steps{    
         script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            }
        }
      }
    }
  }
}