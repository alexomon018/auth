pipeline {
    agent any 

    tools {nodejs "npm"}

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
          dockerImage = docker.build("auth:auth-backend-v1", "--platform=linux/amd64 .") registry
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