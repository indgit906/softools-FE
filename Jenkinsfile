pipeline {
    agent any
    environment {
        DOCKER_HUB_USER = credentials('dockerhub-username')
        DOCKER_HUB_PASS = credentials('dockerhub-password')
        IMAGE_NAME = "${DOCKER_HUB_USER}/softools-fe"
    }

    stages {
        stage('Checkout SCM') {
            steps { checkout scm }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps { sh "docker build -t ${IMAGE_NAME}:latest ." }
        }

        stage('Push Docker Image') {
            steps {
                sh "echo ${DOCKER_HUB_PASS} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps { sh "kubectl apply -f deployment.yaml" }
        }
    }
}

