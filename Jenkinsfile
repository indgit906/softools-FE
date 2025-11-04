pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        DOCKER_CREDENTIALS = 'docker-hub-creds'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test in Docker') {
            steps {
                script {
                    docker.withRegistry('', env.DOCKER_CREDENTIALS) {
                        docker.image("node:${env.NODE_VERSION}").inside('-u 116:123') {
                            sh 'npm install'
                            sh 'npm run build'
                            sh 'npm test'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}

