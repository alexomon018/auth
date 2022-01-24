pipeline {
    agent any 
    environment {
        //once you sign up for Docker hub, use that user_id here
        registry = "mojdockerbre/auth:auth-loginapp-v1-prod"
        //- update your credentials ID after creating credentials for connecting to Docker Hub
        registryCredential = 'auth-app-tokencina'
        dockerImage = ''
    }
    
    stages {
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/alexomon018/auth']]])       
            }
        }
    
    // Building Docker images
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry
        }
      }
    }
    
     // Uploading Docker images into Docker Hub
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