from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.models import Variable
import requests
import csv
from datetime import datetime

# URL del archivo CSV
CSV_URL = Variable.get("CSV_URL")

START_ROW_INDEX_KEY = "START_ROW_INDEX"

class RowDataException(Exception):
    """Excepción personalizada para datos insuficientes o inválidos en una fila."""
    def __init__(self, row_number, row_data, missing_columns, column_map):
        self.row_number = row_number
        self.row_data = row_data
        self.missing_columns = missing_columns
        self.column_map = column_map  # Mapea columnas con datos faltantes
        detailed_info = self._generate_error_message()
        super().__init__(detailed_info)

    def _generate_error_message(self):
        """Genera un mensaje de error detallado."""
        missing_details = "\n".join(
            f"    - Columna '{col}': falta o es inválido."
            for col in self.missing_columns
        )
        return (
            f"Fila {self.row_number} tiene datos insuficientes:\n"
            f"  Datos: {self.row_data}\n"
            f"  Problemas:\n{missing_details}"
        )

def test_db_connection():
    """Prueba la conexión a la base de datos."""
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT 1;")
    print("Conexión a la base de datos exitosa.")
    cursor.close()
    conn.close()

def check_table_exists():
    """Verifica si la tabla 'forms' existe en la base de datos."""
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT to_regclass('public.forms');
        """
    )
    result = cursor.fetchone()
    if result[0] is None:
        error_message = """
        ╔════════════════════════════════════════════════════════════════════╗
        ║ La tabla 'forms' no existe en la base de datos.                    ║
        ║                                                                    ║
        ║ El DAG se detuvo porque no existe una tabla 'forms' creada en la  ║
        ║ base de datos...                                                   ║
        ║                                                                    ║
        ║ Por favor ejecute el DAG para crear la tabla 'forms' en la base    ║
        ║ de datos.                                                           ║
        ╚════════════════════════════════════════════════════════════════════╝
        """
        print(error_message)
        raise Exception("La tabla 'forms' no existe en la base de datos.")
    
    success_message = """
    ╔════════════════════════════════════════════════════════════════════╗
    ║ La tabla 'forms' existe en la base de datos.                        ║
    ╚════════════════════════════════════════════════════════════════════╝
    """
    print(success_message)
    cursor.close()
    conn.close()

def get_table_columns():
    """Obtiene y devuelve un diccionario con los índices y las columnas de la tabla forms."""
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'forms' AND column_name <> 'id';
        """
    )
    columns = {index + 1: row[0] for index, row in enumerate(cursor.fetchall())}
    print(f"Columnas de la tabla 'forms': {columns}")
    cursor.close()
    conn.close()
    return columns

def process_csv_and_insert_to_db():
    """Procesa el CSV e inserta los datos en la tabla forms."""
    # Obtener el índice inicial desde las variables de Airflow
    start_row_index = int(Variable.get(START_ROW_INDEX_KEY, default_var=1))
    print(f"Iniciando desde la fila: {start_row_index}")

    # Descargar y procesar el CSV
    response = requests.get(CSV_URL)
    response.raise_for_status()
    rows = list(csv.reader(response.text.splitlines()))

    if start_row_index >= len(rows):
        print("No hay más filas para procesar.")
        return

    # Obtener las columnas de la tabla 'forms'
    columns = get_table_columns()
    column_names = list(columns.values())  # Solo los nombres de las columnas

    # Conectar a la base de datos
    hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = hook.get_conn()
    cursor = conn.cursor()

    # Procesar filas desde el índice inicial
    for i, row in enumerate(rows[start_row_index:], start=start_row_index):
        # Mapear datos faltantes a un string vacío o NULL
        row_data = [
            "now()",  # created_at
        ] + [value.strip() if value else "" for value in row[:len(column_names) - 1]]  # Datos del CSV

        # Si hay columnas faltantes, rellenarlas con valores predeterminados
        while len(row_data) < len(column_names):
            row_data.append("")

        try:
            # Insertar fila en la tabla forms
            insert_query = f"""
                INSERT INTO forms ({', '.join(column_names)}) 
                VALUES ({', '.join(['%s'] * len(column_names))});
            """
            cursor.execute(insert_query, row_data)
            print(f"Fila {i} insertada: {row_data}")
        except Exception as e:
            print(f"Error al insertar la fila {i}: {row}. Error: {e}")
            continue

        # Actualizar el índice
        start_row_index = i + 1

    conn.commit()
    cursor.close()
    conn.close()

    # Actualizar la variable START_ROW_INDEX
    Variable.set(START_ROW_INDEX_KEY, start_row_index)
    print(f"Nuevo índice de fila: {start_row_index}")


default_args = {
    'retries': 0,
    'owner': 'Vcntea',  # Define el propietario aquí
}

with DAG(
    "update_Info_DB",
    default_args=default_args,
    description="DAG para procesar un CSV e insertar datos en una base de datos",
    schedule_interval='@daily',
    start_date=datetime(2025, 1, 1),
    catchup=False,
) as dag:
    # El resto de las tareas siguen igual...


    
    test_connection = PythonOperator(
        task_id="test_db_connection",
        python_callable=test_db_connection,
    )

    check_table = PythonOperator(
        task_id="check_table_exists",
        python_callable=check_table_exists,
    )

    fetch_columns = PythonOperator(
        task_id="get_table_columns",
        python_callable=get_table_columns,
    )

    process_csv = PythonOperator(
        task_id="process_csv_and_insert_to_db",
        python_callable=process_csv_and_insert_to_db,
    )

    test_connection >> check_table >> fetch_columns >> process_csv
