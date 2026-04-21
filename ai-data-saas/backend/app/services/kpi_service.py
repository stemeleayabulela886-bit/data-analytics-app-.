import pandas as pd

def generate_kpis(df: pd.DataFrame):
    kpis = {}

    numeric = df.select_dtypes(include="number")

    if not numeric.empty:
        kpis["total"] = numeric.sum().sum()
        kpis["average"] = numeric.mean().mean()
        kpis["max_value"] = numeric.max().max()

    # Growth (if time-based data exists)
    if len(numeric.columns) > 0:
        col = numeric.columns[0]
        kpis["growth_rate"] = (
            (df[col].iloc[-1] - df[col].iloc[0]) / df[col].iloc[0]
            if df[col].iloc[0] != 0 else 0
        )

    return kpis