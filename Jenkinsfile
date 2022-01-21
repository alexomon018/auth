pipeline{

	agent any

	environment {
		DOCKERHUB_CREDENTIALS=credentials('mojdockerbre')
	}

	stages {

		stage('Build Backend') {

			steps {
				sh 'docker buildx build -f dockerfile.prod --platform=linux/amd64  -t  mojdockerbre/auth:auth-backend-v1 .',
			}
		}
		stage('Build LoginApp') {

			steps {
				sh 'docker buildx build -f dockerfile.prod --platform=linux/amd64  -t  mojdockerbre/auth:auth-loginapp-v1-prod .',
			}
		}
		stage('Build MovieApp') {

			steps {
				sh 'docker buildx build -f dockerfile.prod --platform=linux/amd64  -t  mojdockerbre/auth:auth-moviefrontend-v1-prod .',
			}
		}

		stage('Login') {

			steps {
				sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
			}
		}

		stage('Push Backend') {

			steps {
				sh 'docker push mojdockerbre/auth:auth-backend-v1'
			}
		}
		stage('Push LoginApp') {

			steps {
				sh 'docker push mojdockerbre/auth:auth-loginapp-v1-prod'
			}
		}
		stage('Push MovieApp') {

			steps {
				sh 'docker push mojdockerbre/auth:auth-moviefrontend-v1-prod'
			}
		}
	}

	post {
		always {
			sh 'docker logout'
		}
	}

}