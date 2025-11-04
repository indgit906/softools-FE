pipeline {
    agent any

    environment {
        // Docker Hub credentials (username + password)
        DOCKER_HUB_CREDS = credentials('docker-hub-creds') 
        IMAGE_NAME = "inddocker786/softools-fe"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code from GitHub..."
                git branch: 'main', url: 'https://github.com/indgit906/softools-fe.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                echo "📦 Setting up Node.js environment..."
                // Install dependencies if node is not installed
                sh '''
                if ! command -v node > /dev/null; then
                    echo "Node.js not found. Installing..."
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                fi
                node -v
                npm -v
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo "🧹 Cleaning old dependencies..."
                sh 'rm -rf node_modules package-lock.json dist'
                
                echo "📦 Installing dependencies..."
                sh 'npm install'
                
                echo "🚀 Building frontend..."
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "📤 Pushing Docker image to Docker Hub..."
                withDockerRegistry([credentialsId: 'docker-hub-creds', url: '']) {
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "☸️ Deploying to Kubernetes..."
                // Example kubectl command (adjust your context & deployment)
                sh '''
                kubectl set image deployment/softools-fe softools-fe=${IMAGE_NAME}:${TAG} --record
                kubectl rollout status deployment/softools-fe
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            echo "🧹 Cleaning workspace..."
            cleanWs()
        }
    }
}

