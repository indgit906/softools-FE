pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = credentials('dockerhub-username')
        DOCKER_HUB_PASS = credentials('dockerhub-password')
        IMAGE_NAME = "${DOCKER_HUB_USER}/softools-fe"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        // Clean up old files before installing
                        sh '''
                            echo "🧹 Cleaning old dependencies..."
                            rm -rf node_modules package-lock.json dist
                            npm cache clean --force
                            echo "📦 Installing dependencies..."
                            npm install
                            echo "⚙️ Building production bundle..."
                            npm run build
                        '''
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "🐳 Building Docker image..."
                    docker build -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    echo ${DOCKER_HUB_PASS} | docker login -u ${DOCKER_HUB_USER} --password-stdin
                    docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "🚀 Deploying to Kubernetes..."
                    kubectl apply -f deployment.yaml
                '''
            }
        }
    }

    post {
        always {
            // Clean workspace after each run
            cleanWs()
        }
    }
}

