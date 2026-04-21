import pandas as pd

def clean_data(df: pd.DataFrame):
    report = {}

    # Remove duplicates
    before = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = before - len(df)

    # Fill missing values
    missing = df.isnull().sum().to_dict()
    report["missing_values"] = missing

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].fillna("Unknown")
        else:
            df[col] = df[col].fillna(df[col].mean())

    # Convert dates if possible
    for col in df.columns:
        try:
            df[col] = pd.to_datetime(df[col])
            report[f"{col}_converted_to_date"] = True
        except:
            pass

    return df, report