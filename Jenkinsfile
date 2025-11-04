pipeline {
    agent any

    environment {
        // Node cache for faster builds
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
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
                    echo '🧹 Cleaning old dependencies...'
                    sh 'rm -rf node_modules package-lock.json dist'

                    echo '📦 Installing dependencies...'
                    sh 'npm cache clean --force && npm install'

                    echo '⚙️ Building production bundle...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-username',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        echo '🐳 Building Docker image...'
                        sh """
                            docker build -t ${DOCKER_USER}/softools-fe:latest .
                        """
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-username',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        echo '🚀 Pushing Docker image...'
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push ${DOCKER_USER}/softools-fe:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo '☸️ Deploying to Kubernetes...'
                    // Add your kubectl commands here, e.g.:
                    // sh "kubectl apply -f k8s/deployment.yaml"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}

