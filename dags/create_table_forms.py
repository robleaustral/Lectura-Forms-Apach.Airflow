from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.hooks.postgres_hook import PostgresHook
from datetime import datetime
import pandas as pd
import requests
import io
import chardet
from airflow.models import Variable

# URL del archivo CSV
CSV_URL = Variable.get("CSV_URL")

def test_db_connection():
    """Prueba la conexión a la base de datos."""
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT 1;")
    print("Conexión a la base de datos exitosa.")
    cursor.close()
    conn.close()


def check_table_exists(**kwargs):
    """Verifica si la tabla ya existe en la base de datos."""
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()

    # Comprueba si la tabla 'forms' ya existe
    cursor.execute(""" 
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'forms'
        );
    """)
    table_exists = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    # Retorna el id de la tarea a seguir
    return 'skip_tasks' if table_exists else 'map_column_names'


def skip_tasks():
    """Tarea de salto para marcar como completado."""
    print("La tabla ya existe. Se omiten los pasos siguientes.")


def get_csv_encoding(url):
    """Obtiene la codificación del archivo CSV."""
    response = requests.get(url)
    raw_data = response.content
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    return encoding


def map_column_names(**kwargs):
    """Mapea los nombres de las columnas del CSV basándose en sus índices."""
    encoding = get_csv_encoding(CSV_URL)
    print(f"Codificación detectada: {encoding}")
    
    response = requests.get(CSV_URL)
    response.raise_for_status()

    # Lee el CSV con la codificación detectada
    df = pd.read_csv(io.StringIO(response.text), encoding=encoding)
    
    print(f"Nombres originales de las columnas ({encoding}): {df.columns.tolist()}")

    # Lista de nombres amigables en orden
    friendly_names = [
        'marca_temporal',
        'tipo_practica',
        'nombre_contacto',
        'cargo_contacto',
        'correo_contacto',
        'telefono_contacto',
        'nombre_empresa',
        'sitio_web_empresa',
        'unidad_empresa',
        'fechas_practica',
        'modalidad',
        'sede_practica',
        'regimen_trabajo',
        'labores',
        'beneficios',
        'requisitos_especiales',
    ]            
    # aqui en friendly_names hay que mapear segun los nombres que se entreguen de las columnas, en la salida  de la variable nombres originales,
    # podemos observar los nombres de las columnas, vamos escogiendo arbitrariamente y en orden nosotros los nombres que queremos despuer de ver la salida
    # de ellos en los logs en caso de salir error en map column names.

    # Genera el mapeo basado en índices
    column_mapping_rules = {
        df.columns[i]: friendly_names[i]
        for i in range(len(df.columns))
    }

    print(f"Mapping generado: {column_mapping_rules}")
    kwargs['ti'].xcom_push(key='mapped_columns', value=column_mapping_rules)



from airflow.models import Variable
from airflow.providers.postgres.hooks.postgres import PostgresHook

def create_table(**kwargs):
    """Crea o actualiza la tabla en la base de datos con las columnas mapeadas y actualiza START_ROW_INDEX en Airflow."""
    mapped_columns = kwargs['ti'].xcom_pull(task_ids='map_column_names', key='mapped_columns')
    if not mapped_columns:
        raise ValueError("El mapping de columnas no fue encontrado en XCom.")

    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()

    # Verifica si la tabla ya existe
    cursor.execute(""" 
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'forms'
        );
    """)
    table_exists = cursor.fetchone()[0]

    if not table_exists:
        # Crear la tabla si no existe
        cursor.execute("""
            CREATE TABLE forms (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP DEFAULT now()
            );
        """)
        print("Tabla 'forms' creada exitosamente.")

        # Al crear la tabla, actualizar la variable START_ROW_INDEX a 1
        Variable.set("START_ROW_INDEX", 1)
        print("Variable 'START_ROW_INDEX' actualizada a 1 en Airflow.")

    # Obtener columnas existentes
    cursor.execute(""" 
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'forms';
    """)
    existing_columns = {row[0] for row in cursor.fetchall()}

    # Añadir columnas si no existen
    for mapped_column in mapped_columns.values():
        if mapped_column not in existing_columns:
            try:
                cursor.execute(f"""
                ALTER TABLE forms 
                ADD COLUMN "{mapped_column}" TEXT;
                """)
                print(f"Columna '{mapped_column}' añadida.")
            except Exception as e:
                print(f"Error al añadir columna '{mapped_column}': {e}")
        else:
            print(f"La columna '{mapped_column}' ya existe.")

    conn.commit()
    cursor.close()
    conn.close()


default_args = {
    'owner': 'Vicntea',
    'retries': 0,
    'start_date': datetime(2025, 1, 1),
}

with DAG(
    'create_table_forms',
    default_args=default_args,
    schedule_interval=None,
    catchup=False,
) as dag:
    test_connection_task = PythonOperator(
        task_id='test_db_connection',
        python_callable=test_db_connection,
    )

    check_table_task = BranchPythonOperator(
        task_id='check_table_exists',
        python_callable=check_table_exists,
        provide_context=True,
    )

    skip_task = PythonOperator(
        task_id='skip_tasks',
        python_callable=skip_tasks,
    )

    map_columns_task = PythonOperator(
        task_id='map_column_names',
        python_callable=map_column_names,
        provide_context=True,
    )

    create_table_task = PythonOperator(
        task_id='create_table',
        python_callable=create_table,
        provide_context=True,
    )

    test_connection_task >> check_table_task
    check_table_task >> [skip_task, map_columns_task]
    map_columns_task >> create_table_task
