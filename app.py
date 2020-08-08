
# import necessary libraries
import pandas as pd
import json
import pymysql
import os 
#from sqlalchemy import create_engine

pymysql.install_as_MySQLdb()

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from sqlalchemy import func, create_engine

is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True

# Import your config file(s) and variable(s)

if is_heroku == False:
    from config import remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd
else:
    remote_db_endpoint = os.environ.get('remote_db_endpoint')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_name = os.environ.get('remote_db_name')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')

app = Flask(__name__)

engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}/{remote_db_name}")

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# create route that renders about.html template
@app.route("/about")
def aboutPage():
    return render_template("about.html")

@app.route("/learn-more")
def learnMore():
    return render_template("learn-more.html")

# API enpoint with ALL the Data
@app.route("/api/sba_loan_detail")
def sba_startup():
    conn = engine.connect()

    query = '''
        SELECT
            *
        FROM
            sba_loan_detail
        Limit 10000
    '''

    sba_df = pd.read_sql(query, con=conn)

    sba_json = sba_df.to_json(orient='index')

    conn.close()

    return sba_json


# Rouute that Groups data by both State and Business type. Route used for the horzonatal pargraph by type and State
@app.route("/api/business_type_state")
def jobs_supported():
    conn = engine.connect()

    query = '''
       SELECT
            BusinessType
            ,BorrState
            ,Count(BusinessType) AS CountBusinessType
            ,Sum(GrossApproval) AS GrossApproval
        FROM
	        `sba-schema`.sba_loan_detail
        GROUP BY
            BorrState,
            BusinessType
        ORDER BY
	        BorrState
    '''

    jobs_df = pd.read_sql(query, con=conn)

    jobs_json = jobs_df.to_json(orient='records')

    conn.close()

    return jobs_json


# Used to group franchise and year
@app.route("/api/top_franchise")
def top_franchise():
    conn = engine.connect()

    query = '''
        SELECT
            ApprovalFiscalYear,
            FranchiseName,
            sum(GrossApproval) AS GrossApproval
        FROM
            `sba-schema`.sba_loan_detail
        WHERE
            FranchiseName IS NOT NULL
        GROUP BY
            FranchiseName
        ORDER BY
            GrossApproval DESC
        LIMIT 10
    '''

    franchise_df = pd.read_sql(query, con=conn)

    franchise_json = franchise_df.to_json(orient='records')

    conn.close()

    return franchise_json


#Route for table of top banks
@app.route("/api/top_banks")
def top_banks():
    conn = engine.connect()

    query = '''
        SELECT
            BankName,
            ROUND(avg(GrossApproval)) AS AverageApproval,
            BankCity,
            BankState
        FROM
            `sba-schema`.sba_loan_detail
        GROUP BY
            BankName,
            BankState
        ORDER BY
           AverageApproval DESC
    '''

    banks_df = pd.read_sql(query, con=conn)

    banks_json = banks_df.to_json(orient='records')

    conn.close()

    return banks_json

# ------------------------ MAP ENDPOINTS ------------------------------------
@app.route("/api/sba_by_state_approvals")
def fy_state_approvals():

    print('---- TRYING TO OPEN FILE-----------')

    with open('us-states-with-loan-data.json') as json_file:
        try:
            sba_json = json.load(json_file)
        except Exception as e:
            print('---- ERROR ----')
            print(e)
        print(sba_json)

    print('---- OPENED FILE-----------')

    print('---- READY T RETURN -----------')

    return jsonify(sba_json)

# -------------------------- LOAN Frequency ENDPOINTS -------------------------
@app.route("/loan_frequency")
def loan_freq():
    conn = engine.connect()

    query = '''
        SELECT
        	ApprovalFiscalYear as Year,
        	NaicsCode, NaicsDescription as Industry_Classification,
        	count(NaicsDescription) as Industry_Counts
        FROM `sba-schema`.sba_loan_detail
        GROUP BY Year,NaicsDescription
        ORDER BY Year,Industry_Counts DESC
    '''

    sba_df = pd.read_sql(query, con=conn)
    sba_json = sba_df.to_json(orient='records')
    conn.close()

    return sba_json


# ------------------------ GDP by States ENDPOINTS ------------------------------------
@app.route("/states_gdp")
def st_gdp():

    with open('gdp12to19.json') as json_file:
        st_json = json.load(json_file)

    return jsonify(st_json)

@app.route("/")
def test():
    return render_template("test.html")

#-------------------------------SBA DATA BY YEAR FOR STATIC GRAPHH ON INDEX ------------------
# API Route to add SBA Loan amount by year
@app.route("/api/sba_by_year")
def sba_year():
    conn = engine.connect()
    query = '''
        SELECT 
            ApprovalFiscalYear,
            SUM(GrossApproval) AS GrossApproval
        FROM
	        `sba-schema`.sba_loan_detail
        GROUP BY 
            ApprovalFiscalYear
    '''
    sba_by_year_df = pd.read_sql(query, con=conn)
    sbayear_json = sba_by_year_df.to_json(orient='records')
    conn.close()
    return sbayear_json

# ------------------------ BAR CHART RACE -----------------------------------
@app.route('/barchartrace_sample')
def barchartrace():
    conn = engine.connect()

    query = '''
            SELECT
            	ApprovalFiscalYear
            	,NaicsDescription AS name
            	,SUM(GrossApproval) AS value
            FROM
            	sba_loan_detail
            GROUP BY
            	ApprovalFiscalYear
            	,NaicsDescription
            
           
    '''

    data_df = pd.read_sql(query, con=conn)

    # data_df.set_index('ApprovalFiscalYear', inplace=True)

    data_dict = data_df.to_dict(orient='records')

    data_json = data_df.to_json(orient='records')

    with open('data_naics.json', 'w') as json_file:
        json.dump(data_dict, json_file)
    
    return data_json


if __name__ == "__main__":
    app.run(debug=True)
