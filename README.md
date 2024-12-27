# Formularios-de-pr-cticas


#Tutorial de creacion de repo

primero cree el proyecto en next 

npx create-next-app <nombre>

luego..
para instalar apache airflow

pip install apache-airflow

pip install apache-airflow-providers-postgres


luego

airflow db init


con esos comandos en sus carpetas de usuarios, tanto de wndws como linux debio haberse creado la carpeta airflow

pip install apache-airflow-providers-postgres

sudo apt-get install postgresql-client

pip install psycopg2-binary

crear la conexión

airflow connections add 'postgres_default' \
    --conn-type 'postgres' \
    --conn-host 'localhost' \
    --conn-schema 'practica' \
    --conn-login 'postgres' \
    --conn-password 'tu_contraseña' \
    --conn-port '5432'


terminal_1<<airflow webserver --port 8080
terminal_2<<airflow scheduler

