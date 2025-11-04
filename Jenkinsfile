pipeline {
    agent any

    environment {
        // Workspace-local npm cache to avoid root permission issues
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    options {
        // Keep logs of last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout pipeline if it runs too long
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git(
                    url: 'https://github.com/indgit906/softools-fe.git',
                    branch: 'main',
                    credentialsId: 'YOUR_GIT_CREDENTIAL_ID' // Replace with your Git credential
                )
            }
        }

        stage('Build & Test in Docker') {
            steps {
                script {
                    docker.image('node:18').inside {
                        sh '''
                            echo "Using workspace-local npm cache: $NPM_CONFIG_CACHE"
                            mkdir -p $NPM_CONFIG_CACHE
                            npm install
                            npm test
                        '''
                    }
                }
            }
        }

        stage('Optional: Build Docker Image') {
            when {
                expression { return fileExists('Dockerfile') }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhubcred') { // Replace with your DockerHub credentials ID
                        def app = docker.build("your-dockerhub-username/softools-fe:latest")
                        app.push()
                    }
                }
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning workspace..."
            cleanWs()
        }
        success {
            echo "✅ Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}

