import pandas as pd

def suggest_chart(df: pd.DataFrame):
    numeric = df.select_dtypes(include="number")

    if len(numeric.columns) >= 2:
        return {
            "type": "bar",
            "x": numeric.columns[0],
            "y": numeric.columns[1]
        }

    elif len(numeric.columns) == 1:
        return {
            "type": "line",
            "x": df.index.name if df.index.name else "index",
            "y": numeric.columns[0]
        }

    else:
        return {"type": "none"}