pipeline{

	agent any

    environment {
        dockerImage = ''
        registry = "mojdockerbre/auth:auth-loginapp-v1-prod"
        registryCredential = "auth-app-tokencina"
    }
    
    stages{

        stage('Checkout'){

            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/alexomon018/auth']]])
            }
        }

        stage('Build Docker image'){

            steps{
               script{
                   dockerImage = docker.build.registry
               }
            }
        }

        stage("Uploading Docker image"){

            steps{    
               script {
                  docker.withRegistry( '', registryCredential ) {
                  dockerImage.push()
              }
        }
        }
    }
    
	
}