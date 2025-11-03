pipeline {
    agent any
     environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }
    stages {
        stage('Parando servicios...') {
            steps {
                sh '''
                docker-compose -p sgu-agb-10a down || true
                '''
            }
        }

        stage('Eliminando imagenes antiguas') {
            steps { 
                sh '''
                IMAGES=$(docker images --filter "label=com.docker.compose.project=sgu-agb-10a" -q)
                if [ -n "$IMAGES" ]; then
                    docker rmi -f $IMAGES
                else
                    echo "No hay imagenes para eliminar"
                fi
                '''
            }
        }

        stage('Descargando actualizaciones...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando...') {
            steps {
                sh '''
                docker-compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Despliegue exitoso!'
        }
        failure {
            echo 'El despliegue ha fallado.'
        }
        always {
            echo 'Proceso de despliegue finalizado.'
        }
    }
}
