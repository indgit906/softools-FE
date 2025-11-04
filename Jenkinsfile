pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = credentials('docker-hub-username')
        DOCKER_HUB_PASS = credentials('docker-hub-password')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'  // Use Node.js image
                    args '-u 1000:1000'    // Optional: run as non-root
                }
            }
            steps {
                echo '🧹 Cleaning old dependencies...'
                sh 'rm -rf node_modules package-lock.json dist'

                echo '📦 Installing dependencies...'
                sh 'npm install'

                echo '⚙️ Building production bundle...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t ${DOCKER_HUB_USER}/softools-fe:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh 'docker push ${DOCKER_HUB_USER}/softools-fe:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Deploying to Kubernetes...'
                // Add your kubectl commands here
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}

